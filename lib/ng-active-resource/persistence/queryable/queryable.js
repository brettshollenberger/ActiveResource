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
        var klass        = this,
            queryResults = mixin([], FunctionalCollection);

        queryResults.extend(Promiseable);

        klass.emit("where:called", terms);
        terms = standardizeTerms();

        return foundCached() ? returnCached() : returnRemote();

        function standardizeTerms() {
          return _.isObject(terms) ? terms : {};
        }

        function foundCached() {
          return !!findCached();
        }

        function findCached() {
          return klass.queryCache.find(terms);
        }

        function returnCached() {
          var cached = klass.queryCache.find(terms);
          _.each(cached, function(instance) { queryResults.push(instance); });

          queryResults.defer();
          queryResults.resolve({status: "local", 
                                data: {message: "Local instance(s) returned from cache"}});

          return queryResults;
        }

        function returnRemote() {
          var url = klass.api.get("index", terms);

          if (requestInProgress(url)) { 
            waitForResponse(url); 
          } else {
            $http.get(url).error(handleResponse).then(handleResponse)

              function handleResponse(response, status, headers) {
                new HTTPResponseHandler({
                  action:   "where", 
                    url:      url,
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

            Queryable.currentRequests.push(url);
          }

          queryResults.defer();
          return queryResults;
        }

        function requestInProgress(url) {
          return Queryable.currentRequests.include(url);
        }

        function waitForResponse(url) {
          klass.on("where:complete", function(deferred, response, request) {
            if (request.url == url) { return returnCached(); }
          });
        }
      }

      function onSuccess(response) {
        _.each(response.klass.deserialize(response.response), function(rawJson) {
           response.deferred.push(response.klass.createOrUpdate(rawJson));
        }, response.klass);

        response.klass.cacheQuery(response.params, response.deferred);

        always(response);
      }

      function onError(response) {
        response.deferred.response = response.response;

        if (response.deferred.response.data) { 
          response.deferred.response = response.deferred.response.data; 
        }

        always(response);
      }

      function always(response) {
        Queryable.currentRequests.$reject(function(request) {
          return request == response.request.url;
        });
      }
    }

    Queryable.currentRequests = mixin([], FunctionalCollection);

    return Queryable;

  }]);
