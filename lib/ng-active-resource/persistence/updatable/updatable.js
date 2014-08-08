angular
  .module('ngActiveResource')
  .factory('ARUpdatable', [function() {

    Updatable.included = function(klass) {
      klass.after("find", updateInstance);
      klass.after("save", updateInstance);
    }

    function Updatable() {
      this.__update = function(attributes) {
        emit("update:called", this, attributes);
        _.each(attributes, this.updateAttribute, this);
        emit("update:beginning", this, attributes);
        emit("update:complete", this, attributes);

        return this;
      }

      function emit(message, instance, attributes) {
        instance.constructor.emit(message, instance, attributes);
        instance.emit(message, instance, attributes);
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
