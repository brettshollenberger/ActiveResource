angular
  .module('BaseClass')
  .factory('BCValidatable.validators.requiredIf', ['BCValidatable.Validator', function(Validator) {
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

    return new Validator(requiredIf);
  }]);
