angular
  .module('ngActiveResource')
  .factory('ARFunctional.Collection', ['ARMixin', function(mixin) {
    function FunctionalCollection() {
      privateVariable(this, 'where', function(terms) { 
        return mixin(_.where(this, terms, this), FunctionalCollection);
      });

      privateVariable(this, 'first', function() {
        return this[0];
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
