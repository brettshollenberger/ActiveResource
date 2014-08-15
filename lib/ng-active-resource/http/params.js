angular
  .module('ngActiveResource')
  .factory('ARParams', [function() {

    return {
      standardize: function(params) {
        _.each(params, function(value, key) {
          if (_.isUndefined(value) || value == "") { 
            delete params[key]; 
          }
        });

        return params;
      }
    }

  }]);
