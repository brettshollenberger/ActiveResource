angular
  .module('ngActiveResource')
  .factory('ARHTTPConfig', ['$http', function($http) {
    function httpConfig(klass) {
      return _.merge({}, klass.api.$http, {
        headers: {
          "Content-Type": klass.api.mimetype().name,
          "Accept":       klass.api.mimetype().name
        }
      }, _.defaults);
    }

    return httpConfig;
  }]);
