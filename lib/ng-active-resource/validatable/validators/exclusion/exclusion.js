angular
  .module('ngActiveResource')
  .factory('ARValidatable.validators.exclusion', ['ARValidatable.Validator', function(Validator) {
    function exclusion(value, instance, field) {
      if (value === undefined || value === '' || value === null) return true;
      if (!this.from) throw "Exclusion validator must specify 'from' attribute.";
      var included = true;
      this.from.forEach(function(i) {
        if (i == value) { included = false; }
      });
      return included;
    };

    exclusion.message = function() {
      lastVal = 'or ' + this.from.slice(-1);
      joinedArray = this.from.slice(0, -1);
      joinedArray.push(lastVal);
      if (joinedArray.length >= 3) list = joinedArray.join(', ');
      else list = joinedArray.join(' ');
      return "must not be " + list + ".";
    }

    exclusion.title = "exclusion";

    return new Validator(exclusion);
  }]);
