angular
  .module('ngActiveResource')
  .factory('ARReflections.HasManyReflection', ['ARReflections.AbstractReflection', 
  'ARAssociatable.CollectionAssociation',
  function(AbstractReflection, CollectionAssociation) {

    function HasManyReflection(name, options) {
      AbstractReflection.call(this, name, options);

      this.initialize = function(instance, attributes) {
        if (!this.containsAssociation(instance)) {
          this.initializeFor(instance, new CollectionAssociation());
        }

        if (this.containsAssociation(attributes)) {
          instance[this.name].$removeAll();
          _.each(_.flatten([attributes[this.name]]), function(association) {
            instance[this.name].push(association);
          }, this);
        }

        return this;
      }
    }

    return HasManyReflection;
  }]);
