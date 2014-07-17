angular
  .module('ngActiveResource')
  .factory('ARValidatable.validators.required', ['ARValidatable.Validator', function(Validator) {
    function required(value, instance, field) {
      if (value === undefined || value === null) return false;
      if (value.constructor.name == 'String') {
        return !!(value && value.length || typeof value == 'object');
      }
      return value !== undefined;
    };

    required.message = "cannot be blank.";

    return new Validator(required);
  }]);
