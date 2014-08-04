angular
  .module('ngActiveResource')
  .factory('ARQueryCache', ['ARMixin', 'ARFunctional.Collection', 'ARForeignKeyify',
  function(mixin, FunctionalCollection, foreignkeyify) {

    QueryCache.included = function(klass) {
      klass.queryCache  = new QueryCache();
      klass.cacheQuery  = klass.queryCache.cache;

      klass.after("update", removeInstanceFromInappropriateQueries);
      klass.after("update", addInstanceToAppropriateQueries);

      function removeInstanceFromInappropriateQueries(instance) {
        _.chain(klass.queryCache)
         .transform(function(selected, cachedCollection, cacheKey) {
          if (_.chain(cachedCollection).pluck(klass.primaryKey).include(instance[klass.primaryKey]).value()) {
            selected[cacheKey] = cachedCollection;
          }
         }, {})
         .each(function(collectionContainingInstance, cacheKey) {
           if (!instanceBelongsInCachedQuery(foreignkeyify(instance), cacheKey)) {
             collectionContainingInstance.$reject(function(cachedInstance) {
               return cachedInstance == instance;
             });
           }
         });
      }

      function addInstanceToAppropriateQueries(instance) {
        var keyified = foreignkeyify(instance);

        _.each(klass.queryCache, function(cachedCollection, cacheKey) {
          if (instanceBelongsInCachedQuery(keyified, cacheKey)) {
            cachedCollection.push(instance);
          }
        });
      }
    }

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

    function instanceBelongsInCachedQuery(keyified, cacheKey) {
      cacheKey = JSON.parse(cacheKey);
      return _.all(cacheKey, function(value, key) { return String(keyified[key]) == String(value); });
    }

    return QueryCache;
  }]);
