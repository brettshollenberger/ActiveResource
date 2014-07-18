angular
  .module('ngActiveResource')
  .factory('ARMime.toNativeTypes', [function() {
    return function toNativeTypes(object) {
      return _.transform(object, function(result, val, key) {
        if (_.isArray(val)) {
          result[key] = _.map(val, toNativeTypes);
        } else if (_.isObject(val)) { 
          result[key] = toNativeTypes(val); 
        } else if (isNaN(val)) { 
          result[key] = val;
        } else {
          result[key] = parseFloat(val);
        }
      }, {});
    }
  }]);
