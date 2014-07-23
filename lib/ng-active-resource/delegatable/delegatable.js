angular
  .module('ngActiveResource')
  .factory('ARDelegatable', [function() {

    Delegatable.extended = function(klass) {
      klass.delegate = new Delegatable().__delegate;
    }

    function Delegatable() {

      this.__delegate = function(methodNames) {
        var methodNames = _.isArray(methodNames) ? methodNames : [methodNames],
            delegator   = this;

        methodNames.to = function(delegatee) {
          _.each(methodNames, function(methodName) {
            Object.defineProperty(delegator, methodName, {
              enumerable: false,
              configurable: true,
              value: delegateMethod(delegatee, methodName)
            });
          });
        }

        return methodNames;
      }

      function delegateMethod(delegatee, methodName) {
        if (_.isFunction(delegatee[methodName])) { return _.bind(delegatee[methodName], delegatee); }
        if (_.isObject(delegatee[methodName]))   {
          return function() { return delegatee[methodName]; }
        }
      }
    }

    return Delegatable;
  }]);

