angular
  .module('ngActiveResource')
  .factory('ARValidatable.validators.format', ['ARValidatable.Validator', 
  'ARValidatable.validators.format.email', 'ARValidatable.validators.format.zip',
  'ARValidatable.validators.format.regex',
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
