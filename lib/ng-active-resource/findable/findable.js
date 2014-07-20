angular
  .module('ngActiveResource')
  .factory('ARFindable', ['$http', function($http) {
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

          $http.get(klass.api.get("show", terms)).then(function(response) {
            klass.emit("find:complete", instance, response.data);
            instance.resolve(response);
          });

          instance.defer();
          return instance;
        }
      }
    }

    return Findable;
  }]);
