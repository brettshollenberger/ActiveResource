angular
  .module('BaseClass')
  .factory('BCValidatable', [
  'BCValidatable.Field',
  'BCValidatable.validators.absence',
  'BCValidatable.validators.acceptance',
  'BCValidatable.validators.boolean',
  'BCValidatable.validators.confirmation',
  'BCValidatable.validators.exclusion',
  'BCValidatable.validators.format',
  'BCValidatable.validators.inclusion',
  'BCValidatable.validators.integer',
  'BCValidatable.validators.length',
  'BCValidatable.validators.numericality',
  'BCValidatable.validators.required',
  'BCValidatable.validators.requiredIf',
  function(Field) {
    function Validatable() {
      var _validations = {};

      privateVariable(_validations, 'add', function(validationSpec) {
        _.each(validationSpec, addField);
      });

      privateVariable(_validations, 'validate', function(instance, fieldName) {
        var toValidate = getFieldsToValidate(fieldName);
        _.each(toValidate, _.curry(validateField)(instance));
        return instance.$errors.countFor(fieldName) === 0;
      });

      function validateField(instance, validation) {
        if (validation.validate(instance) === false) {
          instance.$errors.add(validation.field, validation.message);
        } else {
          instance.$errors.clear(validation.field, validation.message);
        }
      }

      function getFieldsToValidate(fieldName) {
        if (fieldName && _validations[fieldName]) return _validations[fieldName];

        return _.chain(_validations)
                .map(function(validations) {
                  return validations
                })
                .flatten()
                .value();
      }

      function addField(validationSet, fieldName) {
        if (_validations[fieldName]) _validations[fieldName].addValidators(validationSet)
        else _validations[fieldName] = new Field(fieldName, validationSet);
      }

      this.validations = _validations;
      this.validates   = _validations.add;

      this.__validate = function(fieldName) {
        return this.constructor.validations.validate(this, fieldName);
      }

      Object.defineProperty(this, '__$valid', {
        get: function() { return this.constructor.validations.validate(this); }
      });

      Object.defineProperty(this, '__$invalid', {
        get: function() { return !this.constructor.validations.validate(this); }
      });
    }

    return Validatable;
  }]);
