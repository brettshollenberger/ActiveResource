angular
  .module('ngActiveResource')
  .factory('ARCacheable', function() {

    Cache.included = function(klass) {
      klass.cached = new Cache();
      klass.cache  = klass.cached.cache;
    }

    function Cache() {
      privateVariable(this, 'cache', function(instance) {
        var primaryKey = this.primaryKey;
        if (instance && instance[primaryKey] !== undefined) {
          this.cached[instance[primaryKey]] = instance;
        };
      });

      privateVariable(this, 'isEmpty', function() {
        return !!(!Object.keys(this).length);
      });

      privateVariable(this, 'where', function(terms) {
        return _.where(this, terms, this);
      });
    };

    return Cache;
  });
