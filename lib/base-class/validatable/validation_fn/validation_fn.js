angular
  .module('BaseClass')
  .factory('BCValidatable.ValidationFn', [function() {
    function ValidationFn(validationFn, options) {
      var fn = _.bind(validationFn, options);
      fn.message = configureMessage();

      function configureMessage() {
        if (_.isString(options.message))   return options.message;
        if (_.isFunction(options.message)) return options.message.apply(options);
      }

      return fn;
    }

    return ValidationFn;
  }]);
