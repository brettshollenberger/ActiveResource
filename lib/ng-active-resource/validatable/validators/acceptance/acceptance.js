angular
  .module('ngActiveResource')
  .factory('ARValidatable.validators.acceptance', ['ARValidatable.Validator', function(Validator) {
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

    acceptance.title = "acceptance";

    return new Validator(acceptance);
  }]);
