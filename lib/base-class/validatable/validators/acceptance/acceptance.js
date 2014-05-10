angular
  .module('BaseClass')
  .factory('BCValidatable.validators.acceptance', ['BCValidatable.Validator', function(Validator) {
    function acceptance(value, instance, field) {
      if (not(value)) return true;
      return value == true;
    };

    function not(value) {
      if (value === false) return false;
      return !value;
    };

    acceptance.message = function() {
      return "must be accepted.";
    }

    return new Validator(acceptance);
  }]);
