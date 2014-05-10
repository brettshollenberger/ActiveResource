angular
  .module('BaseClass')
  .factory('BCValidatable.validators.length.max', ['BCValidatable.Validator', function(Validator) {
    function max(value, instance, field) {
      if (value === undefined || value === '' || value === null) return true;
      return value.length <= this.max;
    };

    max.message = function() {
      return "Must be no more than " + this.max + " characters";
    }

    return new Validator(max);
  }]);
