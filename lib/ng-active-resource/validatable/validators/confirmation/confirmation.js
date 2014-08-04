angular
  .module('ngActiveResource')
  .factory('ARValidatable.validators.confirmation', ['ARValidatable.Validator', function(Validator) {
    function confirmation(value, instance, field) {
      var confirmationName  = field + 'Confirmation';
      var confirmationField = instance[confirmationName];
      return value == confirmationField;
    };

    confirmation.message = function() {
      return "must match confirmation field.";
    }

    confirmation.title = "confirmation";

    return new Validator(confirmation);
  }]);
