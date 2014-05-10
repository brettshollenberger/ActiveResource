angular
  .module('BaseClass')
  .factory('BCValidatable.validators.inclusion', ['BCValidatable.Validator', function(Validator) {
    function inclusion(value, instance, field) {
      if (value === undefined || value === '' || value === null) return true;
      if (!this.in) throw "Inclusion validator must specify 'in' attribute.";
      var included = false;
      this.in.forEach(function(i) {
        if (i == value) { included = true; }
      });
      return included;
    };

    inclusion.message = function() {
      lastVal     = 'or ' + this.in.slice(-1);
      joinedArray = this.in.slice(0, -1);
      joinedArray.push(lastVal);
      if (joinedArray.length >= 3) list = joinedArray.join(', ');
      else list = joinedArray.join(' ');
      return "must be included in " + list + ".";
    }

    return new Validator(inclusion);
  }]);
