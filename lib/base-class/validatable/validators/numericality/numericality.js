angular
  .module('BaseClass')
  .factory('BCValidatable.validators.numericality', ['BCValidatable.Validator', function(Validator) {
    function numericality(value, instance, field) {
      if (!value) return true;
      value = String(value);
      if (this.ignore) { value = value.replace(this.ignore, ''); }
      return !isNaN(Number(value));
    };

    numericality.message = function() {
      return "is not a number.";
    }

    return new Validator(numericality);
  }]);
