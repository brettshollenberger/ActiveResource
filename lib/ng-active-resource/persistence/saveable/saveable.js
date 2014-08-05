angular
  .module('ngActiveResource')
  .factory('ARSaveable', ['$http', 'ARHTTPConfig', 'ARHTTPResponseHandler',
  function($http, httpConfig, HTTPResponseHandler) {

    function Saveable() {
      this.__$save = function(attributes, config) {
        var instance   = this,
            klass      = instance.constructor,
            attributes = attributes || {},
            config     = _.merge({}, config, httpConfig(klass), _.defaults);

        klass.emit("save:called", instance, attributes);

        instance.defer();
        instance.update(attributes);

        if (instance.$valid) {
          var url = klass.api.get(createOrUpdate(), instance);

          $http[method()](url, instance.serialize(), config).error(handleResponse).then(handleResponse)

          function handleResponse(response, status) {
            new HTTPResponseHandler({
                action:   "save",
                url:      url,
                response: response,
                status:   status,
                headers:  response.headers,
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
