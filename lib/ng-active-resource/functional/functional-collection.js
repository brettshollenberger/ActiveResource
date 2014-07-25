// FunctionalCollection
//
// Functional programming methods exposed as collection iterators. Primarily these
// are wrappers around Lodash methods, with a few mutating versions added.
//
//  collection.map  => Lodash version, collection bound as context
//  collection.$map => Mutates the collection in-place
//
// All mutating methods are prefaced with a dollar sign (e.g. $map, $reduce, $select,
// $filter, $reject, $compact)
//
angular
  .module('ngActiveResource')
  .factory('ARFunctional.Collection', ['ARMixin', function(mixin) {
    function FunctionalCollection() {
      privateVariable(this, 'each', function(callback) {
        return _.each(this, callback, this);
      });

      privateVariable(this, 'map', function(callback) {
        return mixin(_.map(this, callback, this), FunctionalCollection);
      });

      // Mutating O(n) map
      privateVariable(this, '$map', function(callback) {
        for (var i in this) { this[i] = callback(this[i]); }
        return this;
      });

      privateVariable(this, 'collect', function(callback) {
        return this.map(callback, this);
      });

      // Mutating O(n) collect
      privateVariable(this, '$collect', function(callback) {
        return this.$map(callback, this);
      });

      privateVariable(this, 'pluck', function(attribute) {
        return mixin(_.pluck(this, attribute), FunctionalCollection);
      });

      privateVariable(this, 'inject', function(callback, accumulator) {
        return _.inject(this, callback, accumulator);
      });

      privateVariable(this, 'reduce', function(callback, accumulator) {
        return this.inject(callback, acculumulator);
      });

      privateVariable(this, 'all', function(callback) {
        return _.all(this, callback, this);
      });

      privateVariable(this, 'every', function(callback) {
        return this.all(callback, this);
      });

      privateVariable(this, 'any', function(callback) {
        return _.any(this, callback, this);
      });

      privateVariable(this, 'max', function(callback) {
        return _.max(this, callback, this);
      });

      privateVariable(this, 'min', function(callback) {
        return _.min(this, callback, this);
      });

      privateVariable(this, 'filter', function(callback) {
        return mixin(_.filter(this, callback, this), FunctionalCollection);
      });

      // Mutating O(n) filter
      privateVariable(this, '$filter', function(callback) {
        return this.$map(function(element) {
          if (callback(element)) { return element; }
        }).$compact();;
      });

      privateVariable(this, 'select', function(callback) {
        return this.filter(callback);
      });

      // Mutating O(n) select
      privateVariable(this, '$select', function(callback) {
        return this.$filter(callback);
      });

      privateVariable(this, 'reject', function(callback) {
        return mixin(_.reject(this, callback, this), FunctionalCollection);
      });

      // Mutating O(n) reject
      privateVariable(this, '$reject', function(callback) {
        return this.$map(function(element) {
          if (!callback(element)) { return element; }
        }).$compact();;
      });

      privateVariable(this, 'include', function(element) {
        return _.include(this, element);
      });

      privateVariable(this, 'contains', function(element) {
        return this.include(element);
      });

      privateVariable(this, 'sortBy', function(callback) {
        return _.sortBy(this, callback, this);
      });

      privateVariable(this, 'transform', function(callback, accumulator) {
        return _.transform(this, callback, accumulator);
      });

      privateVariable(this, 'toObject', function(callback) {
        return this.transform(callback, {});
      });

      privateVariable(this, 'compact', function() {
        return mixin(_.compact(this), FunctionalCollection);
      });

      // Mutating O(n) compact
      privateVariable(this, '$compact', function() {
        for (var i = this.length; i--;) {
          if (_.isUndefined(this[i]) || 
              _.isNull(this[i])      || 
              isNaN(this[i])         ||
              this[i] === 0          || 
              this[i] == ""          ||
              this[i] === false) {
            this.splice(i, 1);
          }
        }

        return this;
      });

      // Mutating O(n) removeAll
      privateVariable(this, '$removeAll', function() {
        return this.$map(function(n) { return; })
                   .$compact();
      });

      privateVariable(this, 'count', function(callback) {
        return this.inject(function(sum, el) { if (callback(el)) sum += 1; return sum; }, 0);
      });

      privateVariable(this, 'where', function(terms) { 
        return mixin(_.where(this, terms, this), FunctionalCollection);
      });

      privateVariable(this, 'first', function() {
        return _.first(this);
      });

      privateVariable(this, 'last', function() {
        return _.last(this);
      });

      privateVariable(this, 'isEmpty', function() {
        return _.isEmpty(this);
      });

      privateVariable(this, 'empty', function() {
        return this.isEmpty;
      });
    }

    return FunctionalCollection;
  }]);
