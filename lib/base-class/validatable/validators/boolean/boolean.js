angular
  .module('BaseClass')
  .factory('BCValidatable.validators.boolean', ['BCValidatable.Validator', function(Validator) {
    function boolean(value, instance, field) {
      return value == true || value === false || value == "true" || value == "false"
    };

    boolean.message = function() {
      return "is not a boolean";
    }

    return new Validator(boolean);
  }]);
