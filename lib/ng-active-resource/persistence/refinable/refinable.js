angular
  .module('ngActiveResource')
  .factory('ARRefinable', ['$http', 'ARMixin', 'ARFunctional.Collection', 'ARHTTPConfig', 
  'ARPromiseable', 'ARHTTPResponseHandler', 'ARQueryCache',
  function($http, mixin, FunctionalCollection, httpConfig, Promiseable, HTTPResponseHandler, QueryCache) {

    function Refinable(klass) {
      var refinable   = mixin([], FunctionalCollection);
      refinable.klass = klass;
      refinable.extend(Promiseable);

      klass.watchedCollections.push(refinable);

      privateVariable(refinable, "queries", new QueryCache());

      refinable.where = function(params, config) {
        var params = standardizeParams(params);
            config = _.merge({params: params}, config, httpConfig(klass), _.defaults);

        refinable.mostRecentCall = config.params || {};
        refinable.klass.emit("where:called", params);

        return queryCached(params) ? refine(cachedQuery(params)) : fetchRemote(params, config);
      }

      function queryCached(params) {
        return !!cachedQuery(params);
      }

      function cachedQuery(params) {
        return refinable.queries.find(params);
      }

      function fetchRemote(params, config) {
        var url = klass.api.generateRequest("index", config);

        $http.get(url, config).error(handleResponse).then(handleResponse);

        refinable.defer();
        return refinable;

        function handleResponse(response, status) {
          new HTTPResponseHandler({
              action:   "where",
              url:      url,
              response: response,
              status:   status,
              headers:  response.headers,
              deferred: refinable,
              klass:    klass,
              params:   params,
              success:  onSuccess,
              error:    onError
          });
        }
      }

      function refine(newItems) {
        refinable.$removeAll();
        _.each(newItems, function(item) { refinable.push(klass.createOrUpdate(item)); });

        return refinable;
      }

      function onSuccess(success) {
        refine(success.response);
        always(success);
      }

      function onError() {
      }

      function always(response) {
        var clone = response.deferred.clone();
        refinable.queries.cache(response.request.params, clone);
      }

      function paginationAttribute() {
        return refinable.klass.api.paginationAttribute;
      }

      function standardizeParams(params) {
        var defaults = {};
        defaults[paginationAttribute()] = 1;
        params = _.isObject(params) ? params : {};
        return _.merge(params, refinable.mostRecentCall, defaults, _.defaults);
      }

      return refinable;
    }

    return Refinable;

  }]);
