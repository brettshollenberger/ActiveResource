angular
  .module('ngActiveResource')
  .factory('ARSerializable', ['ARSerializeAssociations', function(serializeAssociations) {

    Serializable.extended = function(klass) {
      klass.prototype.serialize = function() {
        return klass.serialize(this);
      }
    }

    function Serializable() {
      this.serialize = function(object) {
        var klass      = this,
            serialized = serializeAssociations(object, klass.reflections);

        if (_.isFunction(klass.format)) {
          serialized = modelSpecificFormat(klass, serialized);
        }

        serialized = klass.api.mimetype().format(serialized);

        return serialized;
      }

      function modelSpecificFormat(model, object) {
        if (_.isArray(object)) { 
          return _.map(object, model.format); 
        } else {
          return model.format(object);
        }
      }
    }

    return Serializable;
  }]);
