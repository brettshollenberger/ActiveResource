angular
  .module('ngActiveResource')
  .factory('ARConfigurable', [function() {

    Configurable.extended = function(klass) {
      Configurable(klass);
    }

    function Configurable(object) {
      object = object || {};

      var propertyNames  = Object.getOwnPropertyNames(object);
      _.each(propertyNames, function(propertyName) {
        var value = object[propertyName];
        Object.defineProperty(object, propertyName, {
          configurable: true,
          enumerable: true,
          get: function() { return value; },
          set: function(v) {
            if (_.isObject(value)) {
              value = _.merge({}, v, value, _.defaults);
              Configurable(value);
            } else {
              value = v;
            }
          }
        });

        if (_.isObject(value)) {
          Configurable(value);
        }
      });
    }

    return Configurable;
  }]);

