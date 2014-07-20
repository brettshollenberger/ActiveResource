angular
  .module('ngActiveResource')
  .factory('ARSaveable', ['$http', 'ARHTTPConfig', function($http, httpConfig) {

    Saveable.included = function(klass) {
    }

    function Saveable() {
      this.__$save = function(attributes, config) {
        var instance   = this,
            klass      = instance.constructor,
            attributes = attributes || {},
            config     = _.merge({}, config, httpConfig(klass), _.defaults);

        klass.emit("save:called", attributes);

        instance.update(attributes);

        if (instance.$valid) {
          $http[method()](klass.api.get(createOrUpdate(), instance), config)
            .error(onError)
            .then(onSuccess);
        }

        return instance;

        function method() {
          return _.isUndefined(instance.id) ? "post" : "put";
        }

        function createOrUpdate() {
          return _.isUndefined(instance.id) ? "create" : "update";
        }

        function onError(error, status, fn) {
          klass.emit("save:fail", error, status, fn);
        }

        function onSuccess(response) {
          klass.emit("save:data", instance, response);
          klass.emit("save:complete", instance, response.data);
        }
      }
    }

    return Saveable;

  }]);
