angular
  .module('ngActiveResource')
  .factory('ARUpdatable', [function() {

    Updatable.included = function(klass) {
      klass.after("find", updateInstance);
      klass.after("save", updateInstance);
    }

    function Updatable() {
      this.__update = function(attributes) {
        this.constructor.emit("update:called", this, attributes);
        _.each(attributes, this.updateAttribute, this);
        this.constructor.emit("update:beginning", this, attributes);
        this.constructor.emit("update:complete", this, attributes);
      }

      this.__updateAttribute = function(val, key) {
        if (_.isUndefined(this.constructor.reflectOnAssociation(key))) {
          this[key] = val;
        }
      }

      this.__$update = function(attributes, config) {
        return this.$save(attributes, config);
      }
    };

    function updateInstance(instance, response) {
      instance.update(response);
    }

    return Updatable;
  }]);
