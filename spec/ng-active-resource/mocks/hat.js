angular
  .module('Mocks')
  .factory('ARHat', ['ngActiveResource', function(ngActiveResource) {

    Hat.inherits(ngActiveResource.Base);

    function Hat() {
    }

    return Hat;

  }]);

