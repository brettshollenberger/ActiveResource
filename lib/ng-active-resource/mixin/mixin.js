angular
  .module('ngActiveResource')
  .factory('ARMixin', [function() {
    function mixin(receiver, Module) {
      var instance = new Module(),
          propNames = Object.getOwnPropertyNames(instance);

      _.each(propNames, function(propName) {
        if (!receiver.hasOwnProperty(propName)) {
          var descriptor = Object.getOwnPropertyDescriptor(instance, propName);
          Object.defineProperty(receiver, propName, descriptor);
        }
      });

      if (_.isFunction(Module.mixedIn)) {
        Module.mixedIn(receiver);
      }

      return receiver;
    }

    return mixin;
  }]);
