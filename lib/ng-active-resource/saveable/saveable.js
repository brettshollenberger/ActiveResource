angular
  .module('ngActiveResource')
  .factory('ARSaveable', ['$http', function($http) {

    Saveable.included = function(klass) {
    }

    function Saveable() {
      this.__$save = function(attributes) {
        var instance   = this,
            klass      = instance.constructor,
            attributes = attributes || {};

        klass.emit("save:called", attributes);

        instance.update(attributes);

        if (instance.$valid) {
          $http[method()](klass.api.get(createOrUpdate(), instance)).then(function(response) {
            klass.emit("save:complete", instance, response.data);
          });
        }

        return instance;

        function method() {
          return _.isUndefined(instance.id) ? "post" : "put";
        }

        function createOrUpdate() {
          return _.isUndefined(instance.id) ? "create" : "update";
        }
      }
    }

    return Saveable;

  }]);
