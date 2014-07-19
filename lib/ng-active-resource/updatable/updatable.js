angular
  .module('ngActiveResource')
  .factory('ARUpdatable', [function() {

    Updatable.included = function(klass) {
      klass.after("find", function(instance, response) {
        instance.update(response);
      });
    }

    function Updatable() {
      this.__update = function(attributes) {
        _.each(attributes, function(val, key) { this[key] = val; }, this);
      }
    };

    return Updatable;
  }]);
