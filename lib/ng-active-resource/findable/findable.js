angular
  .module('ngActiveResource')
  .factory('ARFindable', ['$q', '$http', 'ARUnwrapRoot', function($q, $http, unwrapRoot) {
    function Findable() {
      this.find = function(terms) {
        this.emit("find:called", terms);

        var klass = this;

        if (_.isNumber(terms)) { terms = standardizePrimaryKeySearch(); }
        if (foundCached())     { return cached(); }

        var instance = klass.new();

        $http.get(this.api.get("show", terms)).then(function(response) {
          klass.emit("find:complete", instance, response.data);
        });

        return instance;

        function standardizePrimaryKeySearch() {
          return _.inject([terms], function(terms, id) { terms[klass.primaryKey] = id; return terms; }, {});
        }

        function foundCached() {
          return !!cached();
        }

        function cached() {
          return klass.cached[terms[klass.primaryKey]];
        }
      }
    }

    return Findable;
  }]);
