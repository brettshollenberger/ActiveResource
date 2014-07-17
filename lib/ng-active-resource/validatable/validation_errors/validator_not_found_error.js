angular
  .module('ngActiveResource')
  .factory('ARValidatable.ValidatorNotFoundError', [function() {
    function ValidatorNotFoundError(name) {
      this.name    = "ValidatorNotFoundError";
      this.message = "No validator found by the name of `" + name + "`. Custom validators must define a `validator` key containing the custom validation function.";
    }

    ValidatorNotFoundError.prototype = Error.prototype;

    return ValidatorNotFoundError;
  }]);
