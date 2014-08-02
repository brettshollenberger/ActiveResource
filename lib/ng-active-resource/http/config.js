angular
  .module('ngActiveResource')
  .factory('ARHTTPConfig', ['$http', function($http) {
    function httpConfig(klass) {
      return {
        params: klass.api.params,
        headers: {
          "Content-Type": klass.api.mimetype().name,
          "Accept":       klass.api.mimetype().name
        }
      }
    }

    return httpConfig;
  }]);
