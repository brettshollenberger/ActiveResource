// Configurable
//
// Configuration objects should be easy to change, leaving little room for client error.
//
// Take for example an $http configuration object:
//
//  $httpConfig = {
//    cache: true,
//    headers: {
//      "Content-Type": "application/json",
//      "Accept": "application/json"
//    }
//  }
//
// Let's say a user wanted to add their own headers:
//
//  ngActiveResource.api.configure(function(config) {
//    config.headers = {
//      "My-Special-Header": "Good"
//    }
//  });
//
// We don't want this user overriding the other headers. The Configurable module ensures they don't.
//
//  $httpConfig.extend(ngActiveResource.Configurable);
//
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

