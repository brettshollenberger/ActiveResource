angular
  .module('ngActiveResource')
  .factory('ARReflections.BelongsToReflection', ['ARReflections.AbstractReflection',
  function(AbstractReflection) {

    function BelongsToReflection(name, options) {
      var reflection = this;

      AbstractReflection.call(reflection, name, options);

      reflection.initialize = function(instance, attributes) {
        mixin(attributes, InitializeAttributes);

        if (this.containsAssociation(attributes)) {
          return this.initializeFor(instance, attributes[this.name]);
        } 

        if (this.containsForeignKey(attributes)) {
          return this.initializeFor(instance, this.klass.cached.find(
                                                attributes.foreignKey()));
        }

        function InitializeAttributes() {
          privateVariable(this, 'foreignKey', function() {
            return this[reflection.foreignKey];
          });
        }
      }
    }

    return BelongsToReflection;
  }]);
