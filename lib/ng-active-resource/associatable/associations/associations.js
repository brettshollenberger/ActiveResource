angular
  .module('ngActiveResource')
  .factory('ARAssociatable.Associations', ['ARMixin', 'ARFunctional.Collection', 
  function(mixin, FunctionalCollection) {
    function Associations() {
      mixin(this, FunctionalCollection);
    }

    return Associations;
  }]);

