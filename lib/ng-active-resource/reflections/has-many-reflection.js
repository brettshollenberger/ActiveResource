angular
  .module('ngActiveResource')
  .factory('ARReflections.HasManyReflection', ['ARReflections.AbstractReflection', 
  function(AbstractReflection) {

    function HasManyReflection(name, options) {
      AbstractReflection.call(this, name, options);
    }

    return HasManyReflection;
  }]);
