angular
  .module('ngActiveResource')
  .factory('ARAssociatable.AssociatedCollection', ['ARMixin', 'ARFunctional.Collection',
  function(mixin, FunctionalCollection) {
    function AssociatedCollection(klass, ownerInstance) {
      var associatedCollection = mixin([], FunctionalCollection);

      privateVariable(
        associatedCollection,
        'klass',
        klass
      );

      privateVariable(
        associatedCollection,
        'owner',
        ownerInstance
      );

      privateVariable(
        associatedCollection,
        'inverseAssociation',
        klass.associations.where({klass: ownerInstance.constructor}).first()
      );

      privateVariable(
        associatedCollection, 
        'inverse',
        associatedCollection.inverseAssociation.klass
      );

      privateVariable(
        associatedCollection, 
        'belongsTo', 
        associatedCollection.inverse
      );

      privateVariable(associatedCollection, 'new', function(options) {
        options = standardizeNewOptions(options);

        return klass.new(options).tap(function(instance) {
          associatedCollection.nodupush(instance);
        });
      });

      privateVariable(associatedCollection, 'add', function(instance) {
        associatedCollection.nodupush(instance);
      });

      function inverseAssociationName() {
        return associatedCollection.inverseAssociation.associationName;
      }

      function ownerClass() {
        return ownerInstance.constructor;
      }

      function standardizeNewOptions(options) {
        var defaults = {};
        defaults[inverseAssociationName()] = ownerInstance;
        return _.defaults({}, options, defaults);
      }

      return associatedCollection;
    }

    return AssociatedCollection;
  }]);

