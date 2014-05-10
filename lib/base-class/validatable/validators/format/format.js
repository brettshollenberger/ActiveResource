angular
  .module('BaseClass')
  .factory('BCValidatable.validators.format', ['BCValidatable.Validator', 
  'BCValidatable.validators.format.email', 'BCValidatable.validators.format.zip',
  'BCValidatable.validators.format.regex',
  function(Validator, email, zip, regex) {
    function format() {};
    format.message = "is not the correct format.";

    format.options = {
      email: email,
      zip: zip,
      regex: regex
    }

    return new Validator(format);
  }]);
