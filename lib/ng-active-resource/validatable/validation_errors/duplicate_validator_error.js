angular
  .module('ngActiveResource')
  .factory('ARValidatable.DuplicateValidatorError', [function() {
    function DuplicateValidatorError(name) {
      this.name    = "DuplicateValidatorError";
      this.message = "A validator by the name '" + name + "' has already been registered.";
    }

    DuplicateValidatorError.prototype = Error.prototype;

    return DuplicateValidatorError;
  }]);
