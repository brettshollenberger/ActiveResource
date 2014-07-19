angular
  .module('ngActiveResource')
  .factory('ARAssociatable.Associations', ['ARMixin', 'ARFunctional.Collection', 
  function(mixin, FunctionalCollection) {
    function Associations() {
      mixin(this, FunctionalCollection);
      // privateVariable(this, 'where', function(terms) {
      //   return _.where(this, terms, this);
      // });
    }

    return Associations;
  }]);

