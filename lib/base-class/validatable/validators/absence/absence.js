angular
  .module('BaseClass')
  .factory('BCValidatable.validators.absence', ['BCValidatable.Validator', function(Validator) {
    function absence(value, instance, field) {
      if (value === undefined || value === null) return true;
      if (value.constructor.name == 'String') { return !!(!value.length); }
      return false;
    };

    absence.message = "must be blank.";

    return new Validator(absence);
  }]);
