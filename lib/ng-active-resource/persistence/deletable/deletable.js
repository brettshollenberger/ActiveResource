angular
  .module('ngActiveResource')
  .factory('ARDeletable', ['$http', 'ARHTTPResponseHandler', 'ARHTTPConfig',
  function($http, HTTPResponseHandler, httpConfig) {

    function Deletable() {
      this.__$delete = function(config) {
        var instance = this,
            klass    = instance.constructor,
            url      = klass.api.get("delete", instance);
            config   = _.merge({}, config, httpConfig(klass), _.defaults);

        klass.emit("delete:called", instance);

        instance.defer();

        $http.delete(url, config).error(handleResponse).then(handleResponse);

        function handleResponse(response, status, headers) {
          new HTTPResponseHandler({
              action:   "delete",
              url:      url,
              response: response,
              status:   status,
              headers:  headers,
              deferred: instance,
              klass:    klass,
              params:   {},
              success:  onSuccess,
              error:    onError
          });
        }

        return instance;
      }
    }

    function onSuccess(success) {
      _.each(success.deferred, function(value, key) {
        delete success.deferred[key];
      });
    }

    function onError() {
    }

    return Deletable;
  }]);
