angular
  .module('ngActiveResource')
  .factory('ARValidatable.Validation', [function() {
    function Validation(field, validationFn) {
      this.field   = field;
      this.message = validationFn.message;
      this.validate = function(instance) {
        return validationFn(instance[field], instance, field);
      }
    }

    return Validation;
  }]);
