angular
  .module('ngActiveResource')
  .factory('ARValidatable.validators.length.min', ['ARValidatable.Validator', function(Validator) {
    function min(value, instance, field) {
      if (value === undefined || value === '' || value === null) return true;
      return value.length >= this.min;
    }

    min.message = function() {
      return "Must be at least " + this.min + " characters";
    }

    min.title = "min";

    return new Validator(min);
  }]);
