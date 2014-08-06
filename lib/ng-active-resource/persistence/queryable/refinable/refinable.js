angular
  .module('ngActiveResource')
  .factory('ARRefinable', ['$http', 'ARMixin', 'ARFunctional.Collection', 'ARHTTPConfig', 
  'ARPromiseable', 'ARHTTPResponseHandler', 'ARQueryCache', 'ARPaginatable',
  function($http, mixin, FunctionalCollection, httpConfig, Promiseable, 
  HTTPResponseHandler, QueryCache, Paginatable) {

    function Refinable(klass) {
      var refinable   = mixin([], FunctionalCollection, Paginatable);
      refinable.klass = klass;
      refinable.extend(Promiseable);

      klass.watchedCollections.push(refinable);

      privateVariable(refinable, "queries", new QueryCache());

      refinable.where = function(params, config) {
        var params = standardizeParams(params);
            config = _.merge({params: params}, config, httpConfig(klass), _.defaults);

        if (!config.preload) {
          refinable.mostRecentCall = config.params || {};
        }

        refinable.klass.emit("where:called", params);

        return queryCached(params) ? refine(cachedQuery(params)) : fetchRemote(params, config);
      }

      refinable.paginationAttribute = function() {
        return refinable.klass.api.paginationAttribute;
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
              config:   config,
              success:  onSuccess,
              error:    onError
          });
        }
      }

      function createOrUpdate(instances) {
        return mixin(_.map(instances, function(instance) { return klass.createOrUpdate(instance); }),
                     FunctionalCollection);
      }

      function refine(instances) {
        refinable.$removeAll();
        _.each(instances, function(instance) { refinable.push(instance); });

        return refinable;
      }

      function onSuccess(success) {
        var newInstances = always(success);
        if (!success.config.preload) { refine(newInstances); }
      }

      function onError(error) {
        error.deferred.response = error.response;

        if (error.deferred.response.data) { 
          error.deferred.response = error.deferred.response.data; 
        }
      }

      function always(response) {
        var newInstances = createOrUpdate(response.response);
        refinable.queries.cache(response.request.params, newInstances);
        return newInstances;
      }

      function standardizeParams(params) {
        var defaults = {};
        defaults[refinable.paginationAttribute()] = 1;
        params = _.isObject(params) ? params : {};
        return _.merge(params, refinable.mostRecentCall, defaults, _.defaults);
      }

      return refinable;
    }

    return Refinable;

  }]);
