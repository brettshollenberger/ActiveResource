angular
  .module('ngActiveResource')
  .factory('ARFindable', ['$q', '$http', 'ARUnwrapRoot', function($q, $http, unwrapRoot) {
    function Findable() {
      this.find = function(terms) {
        var deferred = $q.defer(),
            klass    = this;

        if (_.isNumber(terms)) { 
          terms = _.inject([terms], function(o, id) { o.id = id; return o }, {})
        }

        $http.get(this.api().get("show", terms)).then(function(response) {
          deferred.resolve(klass.new(klass.deserialize(response)));
        });

        return deferred.promise;
      }
    }

    return Findable;
  }]);
