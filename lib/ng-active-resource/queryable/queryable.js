angular
  .module('ngActiveResource')
  .factory('ARQueryable', ['$http', 'ARMixin', 'ARFunctional.Collection', 'ARPromiseable',
  'ARAPIResponseHandler',
  function($http, mixin, FunctionalCollection, Promiseable, APIResponseHandler) {

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

          $http.get(klass.api.get("index", terms)).then(function(response) {
            new APIResponseHandler({action: "where", 
                                    response: response,
                                    deferred: queryResults,
                                    klass: klass,
                                    params: terms});
            // klass.emit("where:complete", queryResults, terms);
            // queryResults.resolve(queryResults);
          });

          queryResults.defer();
          return queryResults;
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
