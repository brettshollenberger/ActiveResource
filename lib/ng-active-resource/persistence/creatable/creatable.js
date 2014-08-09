angular
  .module('ngActiveResource')
  .factory('ARCreatable', ['AREventable', function(Eventable) {

    function Creatable() {
      this.new = function(attributes) {
        attributes = attributes || {};

        this.emit("new:called", attributes);

        var instance = new this(attributes);
        this.emit("new:beginning", instance, attributes);

        instance.extend(Eventable, {private: true});
        instance.buildComputedProperties();

        this.emit("new:complete", instance)
        return instance;
      }

      this.$create = function(attributes, config) {
        return this.new().$save(attributes, config);
      }

      this.createOrUpdate = function(attributes) {
        attributes = attributes || {};

        if (this.findCached(attributes)) { return this.findCached(attributes).update(attributes); }

        return this.new(attributes);
      }
    }

    return Creatable;
  }]);
