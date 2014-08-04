angular
  .module('ngActiveResource')
  .factory('ARValidatable', [
  'ARValidatable.Field',
  'ARValidatable.validators.absence',
  'ARValidatable.validators.acceptance',
  'ARValidatable.validators.boolean',
  'ARValidatable.validators.confirmation',
  'ARValidatable.validators.exclusion',
  'ARValidatable.validators.format',
  'ARValidatable.validators.inclusion',
  'ARValidatable.validators.integer',
  'ARValidatable.validators.length',
  'ARValidatable.validators.numericality',
  'ARValidatable.validators.required',
  'ARValidatable.validators.requiredIf',
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

      privateVariable(_validations, 'validateIfErrored', function(instance, fieldName) {
        var toValidate = getFieldsToValidate(fieldName);
        toValidate = _.select(toValidate, function(field) { return instance.$errors[field.field]; });
        if (_.isEmpty(toValidate)) { return; }
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

      this.__validateIfErrored = function(fieldName) {
        return this.constructor.validations.validateIfErrored(this, fieldName);
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
