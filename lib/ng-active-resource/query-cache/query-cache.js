angular
  .module('ngActiveResource')
  .factory('ARQueryCache', ['ARMixin', 'ARFunctional.Collection', function(mixin, FunctionalCollection) {

    QueryCache.included = function(klass) {
      klass.queryCache  = new QueryCache();
      klass.cacheQuery  = klass.queryCache.cache;
    }

    function QueryCache() {
      privateVariable(this, 'cache', function(query, cachedResult) {
        this[this.createCacheKey(query)] = cachedResult;
      });

      privateVariable(this, 'find', function(query) {
        return this[this.createCacheKey(query)];
      });

      privateVariable(this, 'createCacheKey', function(query) {
        var keys     = _.keys(query).sort();
        return JSON.stringify(
          _.inject(keys, function(cacheKey, key) { cacheKey[key] = query[key]; return cacheKey; }, {})
        );
      });
    };

    return QueryCache;
  }]);
