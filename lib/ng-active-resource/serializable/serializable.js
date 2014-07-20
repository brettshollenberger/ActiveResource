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

        if (_.isFunction(klass.format)) { serialized = modelSpecificFormat(klass, serialized); }

        serialized = foreignKeyify(serialized, klass.associations);

        serialized = klass.api.mimetype().format(serialized);

        return serialized;
      }

      // Comment { post: { id: 1, title: "My Great Title" } }
      // >> Comment { post_id: 1 }
      function foreignKeyify(serialized, associations) {
        return _.transform(associations, function(newSerialized, association) {
          if (association.foreignKey && serialized[association.associationName]) {
            serialized[association.foreignKey] = serialized[association.associationName]
                                                           [association.klass.primaryKey];
            delete serialized[association.associationName];
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
