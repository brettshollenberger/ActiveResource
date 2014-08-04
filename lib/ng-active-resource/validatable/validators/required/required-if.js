angular
  .module('ngActiveResource')
  .factory('ARValidatable.validators.requiredIf', ['ARValidatable.Validator', function(Validator) {
    function requiredIf(value, instance, field) {
      if (!this.requiredIf(value, instance, field)) {
        return true;
      } else {
        if (value === undefined || value === null) return false;
        if (value.constructor.name == 'String') {
          return !!(value && value.length || typeof value == 'object');
        }
        return value !== undefined;
      }
    };

    requiredIf.message = "cannot be blank.";
    requiredIf.title   = "requiredIf";

    return new Validator(requiredIf);
  }]);
