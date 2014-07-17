angular
  .module('ngActiveResource')
  .factory('ARValidatable.validators.format.email', ['ARValidatable.Validator', function(Validator) {
    function email(value, instance, field) {
      if (value === undefined || value === '' || value === null) return true;
      return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/.test(value);
    };

    email.message = function() {
      return "is not a valid email.";
    }

    return new Validator(email);
  }]);
