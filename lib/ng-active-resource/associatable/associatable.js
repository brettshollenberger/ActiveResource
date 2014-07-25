angular
  .module('ngActiveResource')
  .factory('ARAssociatable', [function() {

    Associatable.included = function(klass) {
      klass.during("new", setAssociations);
      klass.during("update", setAssociations);

      function setAssociations(instance, attributes) {
        _.each(klass.reflections, function(reflection) {
          reflection.initialize(instance, attributes);
        });
      }
    }

    function Associatable() {
    }

    return Associatable;
  }]);
