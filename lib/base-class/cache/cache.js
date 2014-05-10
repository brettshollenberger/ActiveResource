angular
  .module('BaseClass')
  .factory('BCCacheable', function() {
    function Cache() {

      var cached = {};

      privateVariable(cached, 'cache', function(instance) {
        var primaryKey = this.primaryKey;
        if (instance && instance[primaryKey] !== undefined) {
          cached[instance[primaryKey]] = instance;
        };
      });

      privateVariable(cached, 'isEmpty', function() {
        return !!(!Object.keys(cached).length);
      });

      privateVariable(cached, 'where', function(terms) {
        return _.where(cached, terms, cached);
      });

      this.cached = cached;
      this.cache  = this.cached.cache;
    };

    return Cache;
  });
