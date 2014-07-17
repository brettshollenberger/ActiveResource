angular
  .module('ngActiveResource')
  .factory('ARAPI', [function() {
    function API() {
      var api  = {};

      this.api = function() {
        api.klass = this;
        return api;
      }

      api.set = function(baseURL) {
        api.baseURL   = api.standardizeBaseURL(baseURL);
        api.indexURL  = api.resourcesURL();
        api.createURL = api.resourcesURL();
        api.showURL   = api.resourceURL();
        api.updateURL = api.resourceURL();
        api.deleteURL = api.resourceURL();

        return api;
      }

      api.standardizeBaseURL = function(baseURL) {
        baseURL = removeTrailingSlash(baseURL);
        baseURL = standardizeProtocol(baseURL);
        return baseURL;
      }

      api.resourcesURL = function() {
        return "/" + api.klass.name.underscore().pluralize();
      }

      api.resourceURL = function() {
        return api.resourcesURL() + "/:" + api.klass.primaryKey;
      }

      api.format = function(format) {
        return api;
      }

      function standardizeProtocol(baseURL) {
        if (containsProtocol(baseURL)) { return baseURL; }
        return standardProtocol() + baseURL;
      }

      function containsProtocol(url) {
        return !!(url.match(protocolRegex()));
      }

      function protocolRegex() {
        return /\w+\:\/\//;
      }

      function standardProtocol() {
        return "http://"
      }

      function removeTrailingSlash(baseURL) {
        if (baseURL.slice(-1) == "/") { return baseURL.slice(0, -1); }
        return baseURL;
      }
    }

    return API;
  }]);
