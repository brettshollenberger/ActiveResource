angular
  .module('ngActiveResource')
  .factory('ARHTTPConfig', ['$http', function($http) {
    function httpConfig(klass) {
      return {
        data: klass.api.data,
        headers: {
          "Content-Type": klass.api.mimetype().name,
          "Accept":       klass.api.mimetype().name
        }
      }
    }

    return httpConfig;
  }]);
