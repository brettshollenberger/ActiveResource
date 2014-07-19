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

      privateVariable(this, 'collect', function(callback) {
        return this.map(callback, this);
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

      privateVariable(this, 'reject', function(callback) {
        return mixin(_.reject(this, callback, this), FunctionalCollection);
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
        return _.isEmpty(this);
      });
    }

    return FunctionalCollection;
  }]);
