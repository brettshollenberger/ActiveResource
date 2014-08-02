angular
  .module('ngActiveResource')
  .factory('ARReflections.HasManyReflection', ['ARReflections.AbstractReflection', 
  'ARAssociatable.CollectionAssociation',
  function(AbstractReflection, CollectionAssociation) {

    function HasManyReflection(name, options) {
      AbstractReflection.call(this, name, options);

      this.initialize = function(instance, attributes) {
        this.initializeEmptyCollection(instance, attributes);
        this.initializeFromAttributes(instance, attributes);
        this.initializeInverse(instance, attributes);

        return this;
      }

      this.initializeEmptyCollection = function(instance, attributes) {
        if (!this.containsAssociation(instance)) {
          var collection = new CollectionAssociation(instance, this);
          this.initializeFor(instance, collection);
          this.options.inverseOf.watchedCollections.push(collection);
        }
      }

      this.initializeFromAttributes = function(instance, attributes) {
        if (this.containsAssociation(attributes)) {
          instance[this.name].$removeAll();
          _.each(_.flatten([attributes[this.name]]), function(association) {
            instance[this.name].nodupush(association);
          }, this);
        }
      }

      this.initializeInverse = function(instance, attributes) {
        if (this.containsAssociation(instance)) {
          _.each(instance[this.name], function(association) {
            this.inverse().initialize(association,
              _.zipObject([this.inverse().name], [instance]));
          }, this);
        }
      }
    }

    return HasManyReflection;
  }]);
