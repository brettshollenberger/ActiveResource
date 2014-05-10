angular
  .module('BaseClass')
  .factory('BCValidatable.validators.format.zip', ['BCValidatable.Validator', function(Validator) {
    function zip(value, instance, field) {
      if (value === undefined || value === '' || value === null) return true;
      return /(^\d{5}$)|(^\d{5}-{0,1}\d{4}$)/.test(value);
    };

    zip.message = function() {
      return "is not a valid zip code.";
    }

    return new Validator(zip);
  }]);
