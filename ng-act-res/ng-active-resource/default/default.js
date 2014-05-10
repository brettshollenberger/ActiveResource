angular
  .module('ActiveResource')
  .factory('ARDefault', function() {
    return {
      emptyObject: function(variable) {
        if (variable !== undefined) return variable;
        else return {};
      },
      emptyArray: function(variable) {
        if (variable !== undefined) return variable;
        else return [];
      }
    };
  })
