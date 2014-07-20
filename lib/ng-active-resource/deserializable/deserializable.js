angular
  .module('ngActiveResource')
  .factory('ARDeserializable', ['ARUnwrapRoot', function(unwrapRoot) {

    Deserializable.extended = function(klass) {
      klass.after("save", function(instance, response) {
        instance.update(klass.deserialize(response));
      });
    }

    function Deserializable() {
      this.deserialize = function(object) {
        this.emit("deserialize:called", object);
        var deserialized = this.api.mimetype().parse(object);

        if (this.api.unwrapRootElement) { deserialized = unwrapRoot(deserialized); }
        if (_.isFunction(this.parse))     { deserialized = modelSpecificParse(this, deserialized); }

        this.emit("deserialize:complete", object);
        return deserialized;
      }

      function modelSpecificParse(model, object) {
        if (_.isArray(object)) { 
          return _.map(object, model.parse); 
        } else {
          return model.parse(object);
        }
      }
    }

    return Deserializable;
  }]);
