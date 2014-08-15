angular
  .module('ngActiveResource')
  .factory('ARPaginatable', ['ARMixin', 'ARFunctional.Collection',
  function(mixin, FunctionalCollection) {

    function Paginatable() {
    }

    return Paginatable;

  }]);

