angular
  .module('ngActiveResource')
  .factory('ARQueryable', ['$http', 'ARMixin', 'ARFunctional.Collection', 'ARPromiseable',
  'ARHTTPResponseHandler', 'ARQueryCache',
  function($http, mixin, FunctionalCollection, Promiseable, HTTPResponseHandler, QueryCache) {

    Queryable.extended = function(klass) {
      klass.include(QueryCache);
    }

    function Queryable() {
      this.where = function(terms) {
        var klass = this;
        klass.emit("where:called", terms);
        terms = standardizeTerms();

        return returnRemote();
        // return foundCached() ? returnCached() : returnRemote();

        function standardizeTerms() {
          return _.isObject(terms) ? terms : {};
        }

        function returnRemote() {
          var queryResults = mixin([], FunctionalCollection);

          queryResults.extend(Promiseable);

          $http.get(klass.api.get("index", terms))
            .error(handleResponse)
            .then(handleResponse)

          function handleResponse(response, status, headers) {
            new HTTPResponseHandler({
                action:   "where", 
                response: response,
                status:   status,
                headers:  headers,
                deferred: queryResults, 
                klass:    klass, 
                params:   terms, 
                success:  onSuccess, 
                error:    onError
            });
          }

          queryResults.defer();
          return queryResults;
        }
      }

      function onSuccess(response) {
        _.each(response.klass.deserialize(response.response), function(rawJson) {
           response.deferred.push(response.klass.createOrUpdate(rawJson));
        }, response.klass);

        response.klass.cacheQuery(response.params, response.deferred);
      }

      function onError(response) {
        response.deferred.response = response.response;

        if (response.deferred.response.data) { 
          response.deferred.response = response.deferred.response.data; 
        }
      }

      // function foundCached() {
      //   return !!findCached();
      // }

      // function findCached() {
      //   return klass.cached[terms[klass.primaryKey]];
      // }

      // function returnCached() {
      //   var instance = findCached();
      //   instance.defer();
      //   instance.resolve({status: "local", data: {message: "Local instance returned from cache"}});
      //   return instance;
      // }
    }

    return Queryable;

  }]);
