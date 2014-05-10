angular
  .module('BaseClass')
  .factory('BCValidatable.validators.format.regex', ['BCValidatable.Validator', function(Validator) {
    function regex(value, instance, field) {
      if (value === undefined || value === '' || value === null) return true;
      return this.regex.test(value);
    };

    regex.message = function() {
      return "does not match the pattern.";
    }

    return new Validator(regex);
  }]);
