angular
  .module('ngActiveResource')
  .factory('ARValidatable.validators.length', ['ARValidatable.Validator', 
  'ARValidatable.validators.length.max', 'ARValidatable.validators.length.min', 
  'ARValidatable.validators.length.in', 'ARValidatable.validators.length.is',
  function(Validator, max, min, inRange, is) {
        function length() {};
        length.message = "does not meet the length requirements.";

        length.options = {
          max: max,
          min: min,
          in: inRange,
          is: is
        }

        return new Validator(length);
  }]);
