angular
  .module('ngActiveResource')
  .factory('ARUnwrapRoot', [function() {
    return function unwrapRoot(oldObject) {
      return _.transform(oldObject, function(newObject, value, key) { 
        _.each(oldObject[key], function(v, k) { 
          newObject[k] = v; 
        }); 

        return newObject; 
      }, {})
    }
  }]);
