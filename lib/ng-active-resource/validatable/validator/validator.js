angular
  .module('ngActiveResource')
  .factory('ARValidatable.Validator', ['ARValidatable.ValidationFn', 'ARValidatable.validators', 'ARValidatable.ValidatorNotFoundError',
  function(ValidationFn, validators, ValidatorNotFoundError) { 
    function AnonymousValidator(options, name) {
      if (_.isFunction(options.validator)) {
        if (options.message) options.validator.message = options.message;
        return new Validator(options.validator, name);
      }
    }

    function Validator(validationFn, name) {
      if (validationFn.validator)      return new AnonymousValidator(validationFn, name);
      if (!_.isFunction(validationFn)) throw new ValidatorNotFoundError(name);

      this.name      = validationFn.name || name;
      this.title     = validationFn.title || name;
      this.message   = validationFn.message;
      this.configure = function(options) {
        options      = defaultOptions(options);
        if (hasChildren()) return configuredChildren(options);
        return new ValidationFn(validationFn, _.defaults(options, this));
      }

      var validator        = this;
      this.childValidators = {};
      addChildValidators(validationFn.options);
      validators.register(validator);

      function addChildValidators(options) {
        _.each(options, function(value, key) {
          if (isValidator(value)) validator.childValidators[key] = value;
        });
      }

      function isValidator(option) {
        return option.constructor.name == 'Validator';
      }

      function hasChildren() {
        return Object.keys(validator.childValidators).length > 0;
      }

      function configuredChildren(options) {
        return _.chain(validator.childValidators)
                .map(function(childValidator, name) {
                  if (options[name]) return childValidator.configure(options[name]);
                })
                .compact()
                .value();
      }

      function defaultOptions(options) {
        if (!_.isObject(options) || _.isArray(options) || _.isFunction(options)) {
          options = {value: options, message: this.message}
        }
        if (!_.isUndefined(validationFn.name) && _.isUndefined(options[validationFn.name])) {
          options[validationFn.name] = options.value;
        }
        return options;
      }

    }

    return Validator;
  }]);

