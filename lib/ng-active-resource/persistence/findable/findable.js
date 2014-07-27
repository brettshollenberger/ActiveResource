angular
  .module('ngActiveResource')
  .factory('ARFindable', ['$http', 'ARHTTPResponseHandler', 
  function($http, HTTPResponseHandler) {
    function Findable() {
      this.find = function(terms) {
        var klass = this;
        klass.emit("find:called", terms);
        terms = standardizeTerms();

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
          var instance = klass.new();

          $http.get(klass.api.get("show", terms))
            .error(handleResponse)
            .then(handleResponse)

          function handleResponse(response, status, headers) {
            new HTTPResponseHandler({
                action:   "find", 
                response: response,
                status:   status,
                headers:  headers,
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

      function onSuccess(response) {
      }

      function onError(response) {
      }
    }

    return Findable;
  }]);
