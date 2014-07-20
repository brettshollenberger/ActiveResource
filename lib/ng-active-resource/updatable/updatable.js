angular
  .module('ngActiveResource')
  .factory('ARUpdatable', [function() {

    Updatable.included = function(klass) {
      klass.after("find", updateInstance);
    }

    function Updatable() {
      this.__update = function(attributes) {
        this.constructor.emit("update:called", this, attributes);
        _.each(attributes, function(val, key) { this[key] = val; }, this);
        this.constructor.emit("update:complete", this, attributes);
      }
    };

    function updateInstance(instance, response) {
      instance.update(response);
    }

    return Updatable;
  }]);
