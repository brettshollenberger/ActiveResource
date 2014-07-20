angular
  .module('ngActiveResource')
  .factory('ARFindable', ['$http', function($http) {
    function Findable() {
      this.find = function(terms) {
        var klass = this;

        klass.emit("find:called", terms);
        terms = standardizeTerms();

        return foundCached() ? findCached() : findRemote();

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

        function findRemote() {
          var instance = klass.new();

          $http.get(klass.api.get("show", terms)).then(function(response) {
            klass.emit("find:complete", instance, response.data);
          });

          return instance;
        }
      }
    }

    return Findable;
  }]);
