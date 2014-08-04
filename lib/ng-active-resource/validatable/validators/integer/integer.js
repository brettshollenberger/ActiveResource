angular
  .module('ngActiveResource')
  .factory('ARValidatable.validators.integer', ['ARValidatable.Validator', function(Validator) {
    function integer(value, instance, field) {
      if (!value) return true;
      if (value.constructor.name == 'Array') return false;
      if (value.constructor.name == 'Object') return false;
      value = String(value);
      if (value.match(/\./)) return false;
      if (this.ignore) { value = value.replace(this.ignore, ''); }
      return !isNaN(Number(value));
    };

    integer.message = function() {
      return "is not an integer.";
    }

    integer.title = "integer";

    return new Validator(integer);
  }]);
