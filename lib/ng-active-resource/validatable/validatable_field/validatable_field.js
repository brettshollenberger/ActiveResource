angular
  .module('ngActiveResource')
  .factory('ARValidatable.Field', ['ARValidatable.Validator', 
  'ARValidatable.Validation', 'ARValidatable.validators', 
  'ARValidatable.ValidationMessageNotFoundError',
  function(Validator, Validation, validators, ValidationMessageNotFoundError) {
    function Field(name, validationSet) {
      var field = [];

      field.addValidators = function(validationSet) {
        _.each(validationSet, field.addValidator);
      }

      field.addValidator  = function(options, validationName) {
        var validator     = validators.find(validationName) || 
                            new Validator(options, validationName),
            configuredFns = _.flatten([validator.configure(options)]);

        if (_.isUndefined(validator.message)) {
          throw new ValidationMessageNotFoundError(validationName, name);
        }

        _.each(configuredFns, function(configuredFn) {
          field.push(new Validation(name, configuredFn));
        });
      }

      field.addValidators(validationSet);
      return field;
    }

    return Field;
  }]);
