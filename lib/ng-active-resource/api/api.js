angular
  .module('ngActiveResource')
  .factory('ARAPI', ['ARQueryString', function(querystring) {
    function API() {
      var api  = {};

      api.GETURLs = ["indexURL", "showURL"];

      this.api = function() {
        api.klass = this;
        return api;
      }

      api.set = function(baseURL) {
        api.baseURL   = standardizeBaseURL(baseURL);
        api.indexURL  = api.resourcesURL();
        api.createURL = api.resourcesURL();
        api.showURL   = api.resourceURL();
        api.updateURL = api.resourceURL();
        api.deleteURL = api.resourceURL();

        return api;
      }

      api.get = function(action, params) {
        return parameterize(getEndpoint(action), params, isGETURL(action));
      }

      api.resourcesURL = function resourcesURL() {
        return "/" + api.klass.name.underscore().pluralize();
      }

      api.resourceURL = function() {
        return api.resourcesURL() + "/:" + api.klass.primaryKey;
      }

      api.format = function(format) {
        return api;
      }

      function standardizeBaseURL(baseURL) {
        baseURL = removeTrailingSlash(baseURL);
        baseURL = standardizeProtocol(baseURL);
        return baseURL;
      }

      function isGETURL(action) {
        return _.include(api.GETURLs, action + "URL");
      }

      function getEndpoint(action) {
        return api.baseURL + api[action + "URL"];
      }

      function parameterize(url, params, isGETURL) {
        if (isGETURL) { url = appendQueryString(url, params); }
        url = replaceParams(url, params);

        return url;
      }

      function appendQueryString(url, params) {
        var query = buildQueryString(url, params);
        return query.length ? url + "?" + query : url;
      }

      function buildQueryString(url, params) {
        return querystring.stringify(
                _.chain(params)
                 .cloneDeep()
                 .omit(_.isUndefined)
                 .omit(parameterizable)
                 .value()
               );

        function parameterizable(value, key) {
          return _.include(parameterizableParams(url), key);
        }
      }

      function parameterizableParams(url) {
        return _.chain(url.split("/"))
                .reject(function(urlPiece) { return urlPiece[0] != ":" })
                .map(function(param) { return param.slice(1); })
                .value()
      }

      function replaceParams(url, params) {
        return url.replace(/\:(\w+)/g, function(colon, param) { 
          return replaceParam(param, params[param]);
        });
      }

      function replaceParam(paramName, param) {
        if (_.isFunction(specialParameterizationFunction(paramName))) {
          return specialParameterizationFunction(paramName)(param);
        }

        return param;
      }

      function specialParameterizationFunction(paramName) {
        return api["parameterize" + paramName.titleize()];
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
