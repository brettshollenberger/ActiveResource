angular
  .module('ngActiveResource')
  .factory('ARValidatable.validators.length.in', ['ARValidatable.Validator', function(Validator) {
    function inRange(value, instance, field) {
      if (value === undefined || value === '' || value === null) return true;
      return value.length >= this.inRange[0] && value.length <= this.inRange.slice(-1)[0];
    };

    inRange.message = function() {
      return "must be between " + this.inRange[0] + " and " + this.inRange.slice(-1)[0] + " characters.";
    }

    return new Validator(inRange);
  }]);
