angular
  .module('ngActiveResource')
  .factory('ARReflections.BelongsToReflection', ['ARReflections.AbstractReflection', 'ARMixin',
  function(AbstractReflection, mixin) {

    function BelongsToReflection(name, options) {
      var reflection = this;

      AbstractReflection.call(reflection, name, options);

      reflection.initialize = function(instance, attributes) {
        this.initializeByReference(instance, attributes);
        this.initializeFromForeignKey(instance, attributes);
        this.initializeInverse(instance, attributes);

        return this;
      }

      reflection.initializeByReference = function(instance, attributes) {
        if (this.containsAssociation(attributes)) {
          this.initializeFor(instance, attributes[this.name]);
        } 
      }

      reflection.initializeFromForeignKey = function(instance, attributes) {
        if (this.containsForeignKey(attributes)) {
          this.initializeFor(instance,
            this.klass.cached.find(attributes[reflection.foreignKey]));

          if (!_.isUndefined(instance[reflection.name])) {
            delete instance[reflection.foreignKey];
          }
        }
      }

      reflection.initializeInverse = function(instance, attributes) {
        if (this.containsAssociation(instance)) {
          if (instance.hasPrimaryKey() || options.includeWithoutPrimaryKey) {
            instance[this.name][this.inverse().name].nodupush(instance);
          }
        }
      }
    }

    return BelongsToReflection;
  }]);
