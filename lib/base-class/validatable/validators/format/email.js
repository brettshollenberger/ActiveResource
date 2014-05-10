angular
  .module('BaseClass')
  .factory('BCValidatable.validators.format.email', ['BCValidatable.Validator', function(Validator) {
    function email(value, instance, field) {
      if (value === undefined || value === '' || value === null) return true;
      return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/.test(value);
    };

    email.message = function() {
      return "is not a valid email.";
    }

    return new Validator(email);
  }]);
