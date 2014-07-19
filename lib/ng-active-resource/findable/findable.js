angular
  .module('ngActiveResource')
  .factory('ARFindable', ['$q', '$http', 'ARUnwrapRoot', function($q, $http, unwrapRoot) {
    function Findable() {
      this.find = function(terms) {
        this.emit("find:called", terms);

        var klass = this;

        if (_.isNumber(terms)) { 
          if (klass.cached[terms]) { return klass.cached[terms]; }
          terms = standardizePrimaryKeySearch();
        }

        var instance = klass.new();

        $http.get(this.api.get("show", terms)).then(function(response) {
          klass.emit("find:complete", instance, response.data);
        });

        return instance;

        function standardizePrimaryKeySearch() {
          return _.inject([terms], function(terms, id) { terms[klass.primaryKey] = id; return terms; }, {});
        }
      }
    }

    return Findable;
  }]);
