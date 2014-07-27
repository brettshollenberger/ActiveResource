angular
  .module('ngActiveResource')
  .factory('ARPromiseable', ['$q', function($q) {

    Promiseable.extended = function(klass) {
      klass.defer = new Promiseable().__defer;
    }

    function Promiseable() {
      var instance = this;

      privateVariable(instance, "__defer", function() {
        privateVariable(this, "deferred", $q.defer());

        privateVariable(this, "then", function() {
          this.deferred.promise.then.apply(this, arguments);
          return this;
        });

        privateVariable(this, "catch", function() {
          this.deferred.promise.catch.apply(this, arguments);
          return this;
        });

        privateVariable(this, "finally", function() {
          this.deferred.promise.finally;
          return this;
        });

        privateVariable(this, "resolve", function() {
          this.deferred.resolve.apply(this, arguments);
        });

        privateVariable(this, "reject", function() {
          this.deferred.reject.apply(this, arguments);
        });
      });
    }

    return Promiseable;
  }]);
