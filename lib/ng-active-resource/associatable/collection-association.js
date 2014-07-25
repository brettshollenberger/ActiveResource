angular
  .module('ngActiveResource')
  .factory('ARAssociatable.CollectionAssociation', ['ARMixin', 
  'ARFunctional.Collection', 'ARDelegatable',
  function(mixin, FunctionalCollection, Delegatable) {

    function CollectionAssociation(reflection) {
      var collection = mixin([], FunctionalCollection);
      privateVariable(collection, 'constructor', CollectionAssociation);

      collection.extend(Delegatable);

      collection.delegate(
        ["name", "klass", "options", "associationPrimaryKey",
         "inverse", "inverseKlass"]
      ).to(reflection);

      collection.new = function(attributes) {
        mixin(attributes, NewAttributes);

        return collection.klass()
                         .new(attributes.standardize())
                         .tap(function(instance) { collection.push(instance); });
      }

      function NewAttributes() {
        privateVariable(this, 'standardize', function() {
          return _.defaults({}, this, _.zipObject([collection.name()], collection));
        });
      }

      return collection;
    }

    return CollectionAssociation;
  }]);
