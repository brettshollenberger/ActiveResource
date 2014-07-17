// @module ARAPI
//
// The purpose of the API module is to get and set endpoints for RESTful API actions.
//
// //////////////////////////////////////////////////////////////////////
//
// @method api#set
//
// @argument baseURL {string} - The URL to use as the base url:
//
// Each model has its own API that can be set via the api#set method:
//
//    Post.api().set("https://api.edmodo.com");
//
// By default, the set method creates a baseURL and 5 RESTful URLs: 
//
//    Post.api().baseURL   = "https://api.edmodo.com"
//
//    Post.api().indexURL  = "/posts"
//    Post.api().createURL = "/posts"
//    Post.api().showURL   = "/posts/:primaryKey"
//    Post.api().updateURL = "/posts/:primaryKey"
//    Post.api().deleteURL = "/posts/:primaryKey"
//
// The primary key of these URLs is the primaryKey of the model, which defaults to :id.
//
// URLs can be overridden on an individual basis by simply setting the URL:
//
//    Post.api().showURL = "/posts/:title"
//
// //////////////////////////////////////////////////////////////////////
//
// @method api#get
//
// @argument action {string} - The name of the RESTful action ("show", "index", 
//                             "delete", "update", or "create")
//
// @argument params {object} - The parameters to parameterize the URL with
//
// Retrieve a parameterized URL for a given action. GET type actions will append a querystring, while
// all other actions will only replace parameters:
//
//    Post.api().get("show", {id: 1}))
//    >> "https://api.edmodo.com/posts/1"
//
//    Post.api().get("show", {id: 1, title: "My Great Title"}))
//    >> "https://api.edmodo.com/posts/1?title=My Great Title"
//
//    Post.api().get("index", {author_id: 1, published: true})
//    >> "https://api.edmodo.com/posts?author_id=1&published=true"
//
//    Post.api().get("create", {title: "My Great Title"})
//    >> "https://api.edmodo.com/posts"
//
//    Post.api().get("delete", {id: 1, title: "My Great Title"})
//    >> "https://api.edmodo.com/posts/1"
//
//    Post.api().get("update", {id: 1, title: "My Great Title"})
//    >> "https://api.edmodo.com/posts/1"
//
// Certain parameterized URLs, like munged post titles, may require special 
// parameterization functions. For these, simply add a method to your API 
// in the format "parameterizeParamName"
//
//    Post.api().showURL = "/posts/:title"
//
//    Post.api().parameterizeTitle = function(title) {
//      return title.split(" ").join("-").toLowerCase();
//    }
//
//    Post.api().get("show", {id: 1, title: "My Great Title"})
//    >> "https://api.edmodo.com/posts/my-great-title"
//
// The name of this special function should be camelcase, regardless of the param itself:
//
//    Post.api().showURL = "/posts/:the_title"
//    Post.api().parameterizeTheTitle = function() { ... }
//
//    Post.api().showURL = "/posts/:myTitle"
//    Post.api().parameterizeMyTitle = function() { ... }
//
// //////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////

angular
  .module('ngActiveResource')
  .factory('ARAPI', ['ARQueryString', 'ARMime', function(querystring, Mime) {
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
        api.mimetype = Mime.Type.find(format);
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
        url = appendFormat(url);

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

      function appendFormat(url) {
        var pieces = url.split("?");
        pieces[0] = pieces[0] + "." + api.mimetype.subtypeName;
        return pieces.join("?");
      }

      function replaceParam(paramName, param) {
        if (_.isFunction(specialParameterizationFunction(paramName))) {
          return specialParameterizationFunction(paramName)(param);
        }

        return param;
      }

      function specialParameterizationFunction(paramName) {
        return api["parameterize" + paramName.classify()];
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
