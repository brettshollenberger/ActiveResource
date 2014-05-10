angular
  .module('BaseClass')
  .factory('BCValidatable.validators.length', ['BCValidatable.Validator', 
  'BCValidatable.validators.length.max', 'BCValidatable.validators.length.min', 
  'BCValidatable.validators.length.in', 'BCValidatable.validators.length.is',
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
