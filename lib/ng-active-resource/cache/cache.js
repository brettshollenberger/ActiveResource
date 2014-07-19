angular
  .module('ngActiveResource')
  .factory('ARCacheable', ['ARMixin', 'ARFunctional.Collection', function(mixin, FunctionalCollection) {

    Cache.included = function(klass) {
      klass.cached = new Cache();
      klass.cache  = klass.cached.cache;

      klass.after("new", klass.cache);
      klass.after("find", klass.cache);
    }

    function Cache() {
      mixin(this, FunctionalCollection);

      privateVariable(this, 'cache', function(instance) {
        var primaryKey = this.primaryKey;
        if (instance && instance[primaryKey] !== undefined) {
          this.cached[instance[primaryKey]] = instance;
        };
      });

      privateVariable(this, 'find', function(primaryKey) {
        return this[primaryKey];
      });
    };

    return Cache;
  }]);
