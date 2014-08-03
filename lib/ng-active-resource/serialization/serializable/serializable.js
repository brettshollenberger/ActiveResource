angular
  .module('ngActiveResource')
  .factory('ARSerializable', [function() {

    Serializable.extended = function(klass) {
      klass.prototype.serialize = function() {
        return klass.serialize(this);
      }
    }

    function Serializable() {
      this.serialize = function(object) {
        var serialized = _.cloneDeep(object),
            klass      = this;

        serialized = foreignKeyify(serialized, klass.reflections);

        if (_.isFunction(klass.format)) { 
          serialized = modelSpecificFormat(klass, serialized); 
        }

        serialized = klass.api.mimetype().format(serialized);

        return serialized;
      }

      // Comment { post: { id: 1, title: "My Great Title" } }
      // => Comment { post_id: 1 }
      function foreignKeyify(serialized, reflections) {
        return _.transform(reflections, function(newSerialized, reflection) {
          if (reflection.foreignKey && serialized[reflection.name]) {
            serialized[reflection.foreignKey] = serialized[reflection.name]
                                                           [reflection.associationPrimaryKey()];
            delete serialized[reflection.name];
          }
        }, serialized);
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
