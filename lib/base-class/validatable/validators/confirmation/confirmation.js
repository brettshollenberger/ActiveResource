angular
  .module('BaseClass')
  .factory('BCValidatable.validators.confirmation', ['BCValidatable.Validator', function(Validator) {
    function confirmation(value, instance, field) {
      var confirmationName  = field + 'Confirmation';
      var confirmationField = instance[confirmationName];
      return value == confirmationField;
    };

    confirmation.message = function() {
      return "must match confirmation field.";
    }

    return new Validator(confirmation);
  }]);
