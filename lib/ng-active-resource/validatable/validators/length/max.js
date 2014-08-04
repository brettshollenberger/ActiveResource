angular
  .module('ngActiveResource')
  .factory('ARValidatable.validators.length.max', ['ARValidatable.Validator', function(Validator) {
    function max(value, instance, field) {
      if (value === undefined || value === '' || value === null) return true;
      return value.length <= this.max;
    };

    max.message = function() {
      return "Must be no more than " + this.max + " characters";
    }

    max.title = "max";

    return new Validator(max);
  }]);
