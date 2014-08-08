angular
  .module('ngActiveResource')
  .factory('ARDeserializable', ['ARUnwrapRoot', function(unwrapRoot) {

    function Deserializable() {
      this.deserialize = function(object) {
        if (_.isUndefined(object)) { object = {}; }

        var deserialized;

        this.emit("deserialize:called", object);

        if (_.isString(object) && _.isEmpty(object)) {
          deserialized = {};
        } else {
          deserialized = this.api.mimetype().parse(object);
        }

        if (this.api.unwrapRoot)      { deserialized = unwrapRoot(deserialized); }
        if (_.isFunction(this.parse)) { deserialized = modelSpecificParse(this, deserialized); }

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
