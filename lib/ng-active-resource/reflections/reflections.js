angular
  .module('ngActiveResource')
  .factory('ARReflections', [function() {

    Reflections.included = function(klass) {
      privateVariable(klass, "reflections", new Reflections());
    }

    function Reflections() {
    }

    return Reflections;
  }]);
