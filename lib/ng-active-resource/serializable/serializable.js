angular
  .module('ngActiveResource')
  .factory('ARSerializable', [function() {
    function Serializable() {
      this.serialize = function(object) {
        var serialized = _.cloneDeep(object);

        if (_.isFunction(this.format)) { serialized = modelSpecificFormat(this, serialized); }

        serialized = this.api().mimetype().format(serialized);

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
