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

  .factory('ARAssociatable.HasMany', ['ARAssociatable.Association', 
  function(Association) {

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

    function AssociatedCollection(klass, ownerInstance) {
      var associatedCollection = [];

      privateVariable(associatedCollection, 'klass', klass);
      privateVariable(associatedCollection, 'owner', ownerInstance);

      privateVariable(associatedCollection, 'new', function(options) {
        options = standardizeNewOptions(options);

        return klass.new(options).tap(function(instance) {
          associatedCollection.push(instance);
        });
      });

      privateVariable(associatedCollection, 'inverseAssociation',
          klass.associations.where({klass: ownerInstance.constructor}).first());

      function inverseAssociationName() {
        return associatedCollection.inverseAssociation.associationName;
      }

      function ownerClass() {
        return ownerInstance.constructor;
      }

      function standardizeNewOptions(options) {
        var defaults = {};
        defaults[inverseAssociationName()] = ownerInstance;
        return _.defaults(options, defaults);
      }

      return associatedCollection;
    }

    return HasMany;
  }]);
