angular
  .module('ngActiveResource')
  .factory('ARValidatable.validators.absence', ['ARValidatable.Validator', function(Validator) {
    function absence(value, instance, field) {
      if (value === undefined || value === null) return true;
      if (value.constructor.name == 'String') { return !!(!value.length); }
      return false;
    };

    absence.message = "must be blank.";

    return new Validator(absence);
  }]);
