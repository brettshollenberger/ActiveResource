angular
  .module('ngActiveResource')
  .factory('ARRefinable', ['$http', 'ARMixin', 'ARFunctional.Collection', 'ARHTTPConfig', 'ARPromiseable', 'ARHTTPResponseHandler',
  function($http, mixin, FunctionalCollection, httpConfig, Promiseable, HTTPResponseHandler) {

    function Refinable(klass) {
      var refinable   = mixin([], FunctionalCollection);
      refinable.klass = klass;
      refinable.extend(Promiseable);

      klass.watchedCollections.push(refinable);

      privateVariable(refinable, "queries", {});

      refinable.where = function(params, config) {
        var params = standardizeParams(params);
            config = _.merge({params: params}, config, httpConfig(klass), _.defaults);

        refinable.mostRecentCall = config.params || {};
        refinable.klass.emit("where:called", params);

        return fetchRemote(params, config);
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

      function onSuccess(success) {
        _.each(success.response, function(attributes) {
           success.deferred.push(success.klass.createOrUpdate(attributes));
        }, success.klass);
      }

      function onError() {
      }

      function standardizeParams(params) {
        return _.isObject(params) ? params : {};
      }

      return refinable;
    }

    return Refinable;

  }]);
