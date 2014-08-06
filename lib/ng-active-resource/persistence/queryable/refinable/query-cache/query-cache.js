angular
  .module('ngActiveResource')
  .factory('ARQueryCache', ['ARMixin', 'ARFunctional.Collection', 
  function(mixin, FunctionalCollection) {

    function QueryCache() {
      var queryCache = this;

      privateVariable(this, 'cache', function(query, cachedResult) {
        queryCache[queryCache.createCacheKey(query)] = cachedResult;
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
