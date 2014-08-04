angular
  .module('ngActiveResource')
  .factory('ARValidatable.validators.format.regex', ['ARValidatable.Validator', function(Validator) {
    function regex(value, instance, field) {
      if (value === undefined || value === '' || value === null) return true;
      return this.regex.test(value);
    };

    regex.message = function() {
      return "does not match the pattern.";
    }

    regex.title = "regex";

    return new Validator(regex);
  }]);
