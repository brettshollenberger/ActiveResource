angular
  .module('ngActiveResource')
  .factory('ARReflections.BelongsToReflection', ['ARReflections.AbstractReflection',
  function(AbstractReflection) {

    function BelongsToReflection(name, options) {
      AbstractReflection.call(this, name, options);
    }

    return BelongsToReflection;
  }]);
