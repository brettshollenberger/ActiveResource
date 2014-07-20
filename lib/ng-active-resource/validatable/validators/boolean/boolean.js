angular
  .module('ngActiveResource')
  .factory('ARValidatable.validators.boolean', ['ARValidatable.Validator', function(Validator) {
    function boolean(value, instance, field) {
      if (value === undefined || value === '' || value === null) return true;
      return value == true || value === false || value == "true" || value == "false"
    };

    boolean.message = function() {
      return "is not a boolean";
    }

    return new Validator(boolean);
  }]);
