angular
  .module('ngActiveResource')
  .factory('ARValidatable.validators', ['ARValidatable.DuplicateValidatorError', 
  function(DuplicateValidatorError) { 
    var validators = {};

    validators.register = function(validator) {
      var title = validator.title || validator.name;
      if (_.isUndefined(validators[title])) validators[title] = validator;
      else throw new DuplicateValidatorError(title);
    }

    validators.find = function(validatorName) {
      return validators[validatorName];
    }

    return validators;
  }]);
