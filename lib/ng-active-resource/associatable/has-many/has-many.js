angular
  .module('ngActiveResource')
  .factory('ARAssociatable.HasMany', ['ARAssociatable.Association', 'ARAssociatable.AssociatedCollection',
  function(Association, AssociatedCollection) {

    HasMany.include(Association);

    function HasMany(ownerClass, associationName, options) {
      this.instantiate = function(instance, attributes) {
        if (_.isUndefined(instance[associationName])) {
          instance[associationName] = new AssociatedCollection(this.klass, instance);
        }

        if (attributes[associationName]) { addInverseAssociations(); }

        function addInverseAssociations() {
          _.each(attributes[associationName], function(associatedInstance) {
            instance[associationName].inverseAssociation.instantiate(associatedInstance, inverseAttributes());
          });
        }

        function inverseAttributes() {
          return _.transform([instance[associationName].inverseAssociation.associationName],
            function(attrs, inverseName) {
              attrs[inverseName] = instance;
          }, {});
        }
      }

      this.belongsTo       = ownerClass;
      this.options         = options;
      this.associationName = associationName;

      Object.defineProperty(this, 'klass', {
        enumerable: true,
        get: function() { return this.getClass(); }
      });
    }

    return HasMany;
  }]);
