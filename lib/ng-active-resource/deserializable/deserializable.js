angular
  .module('ngActiveResource')
  .factory('ARDeserializable', ['ARUnwrapRoot', function(unwrapRoot) {
    function Deserializable() {
      this.deserialize = function(object) {
        var deserialized = this.api.mimetype().parse(object);

        if (this.api.unwrapRootElement) { deserialized = unwrapRoot(deserialized); }
        if (_.isFunction(this.parse))     { deserialized = modelSpecificParse(this, deserialized); }

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
