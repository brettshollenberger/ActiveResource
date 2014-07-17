angular
  .module('ngActiveResource')
  .factory('ARValidatable.validators', ['ARValidatable.DuplicateValidatorError', 
  function(DuplicateValidatorError) { 
    var validators = {};

    validators.register = function(validator) {
      if (_.isUndefined(validators[validator.name])) validators[validator.name] = validator;
      else throw new DuplicateValidatorError(validator.name);
    }

    validators.find = function(validatorName) {
      return validators[validatorName];
    }

    return validators;
  }]);
