angular
  .module('ngActiveResource')
  .factory('ARFindable', ['$http', 'ARHTTPResponseHandler', 'ARHTTPConfig',
  function($http, HTTPResponseHandler, httpConfig) {
    function Findable() {
      this.find = function(terms, config) {
        var klass = this;
        terms     = standardizeTerms(),
        config    = _.merge({params: terms}, config, httpConfig(klass), _.defaults);

        klass.emit("find:called", terms);

        return foundCached() ? returnCached() : returnRemote();

        // Private
        //////////////////////////////////

        function standardizeTerms() {
          return _.isObject(terms) ? terms : _.inject([terms], function(terms, id) { 
                                              terms[klass.primaryKey] = id; return terms; 
                                             }, {});
        }

        function foundCached() {
          return !!findCached();
        }

        function findCached() {
          return klass.cached[terms[klass.primaryKey]];
        }

        function returnCached() {
          var instance = findCached();
          instance.defer();
          instance.resolve({status: "local", data: {message: "Local instance returned from cache"}});
          return instance;
        }

        function returnRemote() {
          var instance = klass.new(),
              url      = klass.api.generateRequest("show", config);

          $http.get(url, config).error(handleResponse).then(handleResponse)

          function handleResponse(response, status) {
            new HTTPResponseHandler({
                action:   "find", 
                url:      url,
                response: response,
                status:   status,
                headers:  response.headers,
                deferred: instance, 
                klass:    klass, 
                params:   terms, 
                success:  onSuccess, 
                error:    onError
            });
          }

          instance.defer();
          return instance;
        }
      }

      function onSuccess(success) {
      }

      function onError(response) {
      }
    }

    return Findable;
  }]);
