angular
  .module('ngActiveResource')
  .factory('ARValidatable.validators.length.is', ['ARValidatable.Validator', function(Validator) {
    function is(value, instance, field) {
      if (value === undefined || value === '' || value === null) return true;
      return value.length == this.is;
    };

    is.message = function() {
      return "must be " + this.is + " characters.";
    }

    return new Validator(is);
  }]);
