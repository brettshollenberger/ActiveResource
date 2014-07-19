angular
  .module('ngActiveResource')

  .factory('ARAssociatable.HasMany.Builder', ['ARAssociatable.HasMany', function(HasMany) {
    function Builder() {}

    Builder.build = function(klass, associationName, options) {
      var name    = associationName.pluralize().downcase(),
          options = _.isUndefined(options) ? {} : options;

      if (_.isUndefined(klass.associations[name])) {
        return klass.associations[name] = new HasMany(klass, name, options);
      }
    }

    return Builder;
  }])

  .factory('ARAssociatable.HasMany', ['ARAssociatable.Association', 'ARAssociatable.AssociatedCollection',
  function(Association, AssociatedCollection) {

    HasMany.include(Association);

    function HasMany(ownerClass, associationName, options) {
      this.instantiate = function(instance, attributes) {
        instance[associationName] = new AssociatedCollection(this.klass, instance);
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
