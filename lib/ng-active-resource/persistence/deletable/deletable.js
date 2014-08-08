angular
  .module('ngActiveResource')
  .factory('ARDeletable', ['$http', 'ARHTTPResponseHandler', 'ARHTTPConfig',
  function($http, HTTPResponseHandler, httpConfig) {

    function Deletable() {
      this.__$delete = function(config) {
        var instance = this,
            klass    = instance.constructor,
            config   = _.merge({}, config, httpConfig(klass), _.defaults),
            url      = klass.api.generateRequest("delete", {params: _.cloneDeep(instance)});

        klass.emit("delete:called", instance);
        instance.emit("delete:called", instance);
        instance.defer();

        $http.delete(url, config).error(handleResponse).then(handleResponse);

        return instance;

        function handleResponse(response, status) {
          new HTTPResponseHandler({
              action:   "delete",
              url:      url,
              response: response,
              status:   status,
              headers:  response.headers,
              deferred: instance,
              klass:    klass,
              params:   {},
              success:  onSuccess,
              error:    onError
          });
        }
      }
    }

    function onSuccess(success) {
    }

    function onError() {
    }

    return Deletable;
  }]);
