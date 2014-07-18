angular
  .module('ngActiveResource')
  .factory('ARDeserializable', ['ARUnwrapRoot', function(unwrapRoot) {
    function Deserializable() {
      this.deserialize = function(object) {
        var parsed = this.api().mimetype().parse(object);

        if (this.api().unwrapRootElement) { parsed = unwrapRoot(parsed); }
        if (_.isFunction(this.parse))     { parsed = modelSpecificParse(this, parsed); }

        return parsed;
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
