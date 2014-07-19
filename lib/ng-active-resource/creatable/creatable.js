angular
  .module('ngActiveResource')
  .factory('ARCreatable', [function() {

    function Creatable() {
      this.new = function(attributes) {
        attributes = attributes || {};

        this.emit("new:called", attributes);
        var instance = new this(attributes);
        this.emit("new:beginning", instance, attributes);
        this.cache(instance);
        this.emit("new:complete", instance)
        return instance;
      }
    }

    return Creatable;
  }]);
