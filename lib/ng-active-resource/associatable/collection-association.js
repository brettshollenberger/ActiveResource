angular
  .module('ngActiveResource')
  .factory('ARAssociatable.CollectionAssociation', ['ARMixin', 'ARFunctional.Collection',
  function(mixin, FunctionalCollection) {
    function CollectionAssociation() {
      var collection         = [];
      privateVariable(collection, 'constructor', CollectionAssociation);
      mixin(collection, FunctionalCollection);
      return collection;
    }

    return CollectionAssociation;
  }]);
