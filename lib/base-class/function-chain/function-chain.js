(function() {

  angular
    .module('BaseClass')
    .factory('BCFunctionChain', [function() {
      function FunctionChain(attributes) {
        if (attributes === undefined) attributes = {};
        ensureFunctionChainValidity(attributes.functions);

        var functionChain       = attributes.functions || [];
        functionChain.name      = attributes.name      || 'Function chain';
        functionChain.push      = fnChainPush;
        functionChain.unshift   = fnChainUnshift;
        functionChain.remove    = removeFn;
        functionChain.removeAll = removeAllFns;

        return functionChain;
      };

      function ensureFunctionChainValidity(functions) {
        if (functions === undefined) return;
        if (!_.isArray(functions)) {
          throw new FunctionChainInitializationError();
        }
        _.each(functions, function(fn) {
          if (!_.isFunction(fn)) {
            throw new FunctionChainInitializationError();
          }
        });
      };

      function FunctionChainInitializationError() {
        this.name = 'FunctionChainInitializationError';
        this.message = 'Function chain must be an array of functions';
      };

      function fnChainPush() {
        callCoreIfFunction.apply(this, _.flatten(['push', arguments]));
      };

      function fnChainUnshift() {
        callCoreIfFunction.apply(this, _.flatten(['unshift', arguments]));
      };

      function callCoreIfFunction(coreFn) {
        var functionChain = this;
        _.each(Array.prototype.slice.call(arguments, 1), function(argument) {
          ensureFunction.call(this, argument);
          Array.prototype[coreFn].call(functionChain, argument);
        });
      };

      function ensureFunction(argument) {
        if (!_.isFunction(argument)) {
          throw new TypeError(this.name + ' must contain functions');
        }
      };

      function removeFn(fn) {
        var functionChain = this;
        if (_.isFunction(fn)) removeFunction(functionChain, fn);
        if (_.isString(fn))   removeFunctionByName(functionChain, fn);
      };

      function removeFunction(functionChain, fn) {
        _.remove(functionChain, fn);
      };

      function removeFunctionByName(functionChain, fn) {
        _.remove(functionChain, function(f) {
          return f.name == fn;
        });
      };

      function removeAllFns() {
        var functionChain = this;
        _.remove(functionChain, function(fn) { 
          return _.isFunction(fn); 
        });
      };

      return FunctionChain;
    }]);

})();
