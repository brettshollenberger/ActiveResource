angular
  .module('ngActiveResource')
  .factory('ARSaveable', ['$http', 'ARHTTPConfig', 'ARHTTPResponseHandler', '$q', 
  function($http, httpConfig, HTTPResponseHandler, $q) {

    Saveable.included = function(klass) {
    }

    function Saveable() {
      this.__$save = function(attributes, config) {
        var instance   = this,
            klass      = instance.constructor,
            attributes = attributes || {},
            config     = _.merge({}, config, httpConfig(klass), _.defaults);

        klass.emit("save:called", attributes);

        instance.defer();
        instance.update(attributes);

        if (instance.$valid) {
          $http[method()](klass.api.get(createOrUpdate(), instance), config)
            .error(handleResponse)
            .then(handleResponse)

          function handleResponse(response, status, headers) {
            new HTTPResponseHandler({
                action:   "save", 
                response: response,
                status:   status,
                headers:  headers,
                deferred: instance, 
                klass:    klass, 
                params:   attributes, 
                success:  onSuccess, 
                error:    onError
            });
          }
        } else {
          instance.reject(instance.$errors);
        }

        return instance;

        function method() {
          return _.isUndefined(instance.id) ? "post" : "put";
        }

        function createOrUpdate() {
          return _.isUndefined(instance.id) ? "create" : "update";
        }

        function onSuccess(response) {
        }

        function onError(error, status, fn) {
        }
      }
    }

    return Saveable;

  }]);
