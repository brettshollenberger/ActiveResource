angular
  .module('BaseClass')
  .factory('BCValidatable.ValidationMessageNotFoundError', [function() {
    function ValidationMessageNotFoundError(validatorName, fieldName) {
      this.name    = "ValidationMessageNotFound";
      this.message = "Validation message not found for validator '" + validatorName + "' on the field '" + fieldName + ".' Validation messages must be added to validators in order to provide your users with useful error messages.";
    }

    ValidationMessageNotFoundError.prototype = Error.prototype;

    return ValidationMessageNotFoundError;
  }]);
