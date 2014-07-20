angular
  .module('ngActiveResource')
  .factory('ARHTTPConfig', ['$http', function($http) {
    function httpConfig(klass) {
      return {
        headers: {
          "Content-Type": klass.api.mimetype().name,
          "Accept":       klass.api.mimetype().name
        }
      }
    }

    return httpConfig;
  }]);
