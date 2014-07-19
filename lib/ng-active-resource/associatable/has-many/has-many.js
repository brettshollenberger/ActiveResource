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
