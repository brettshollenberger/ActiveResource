angular
  .module('ngActiveResource')
  .factory('ARDeserializable', ['ARUnwrapRoot', function(unwrapRoot) {
    function Deserializable() {
      this.deserialize = function(object) {
        var parsed = this.api().mimetype().parse(object.data);

        if (this.api().unwrapRootElement) { 
          parsed = unwrapRoot(parsed); 
        }

        if (_.isFunction(this.parse)) {
          parsed = this.parse(parsed);
        }

        return parsed;
      }
    }

    return Deserializable;
  }]);
