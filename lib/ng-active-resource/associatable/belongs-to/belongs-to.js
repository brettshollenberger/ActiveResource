angular
  .module('ngActiveResource')
  .factory('ARAssociatable.BelongsTo', ['ARAssociatable.Association', 'ARAssociatable.BelongsTo.Attributes',
  function(Association, BelongsToAttributes) {

    BelongsTo.include(Association);

    function BelongsTo(ownedClass, associationName, options) {

      // find the owner of the belongsTo by name or foreign key
      this.instantiate = function(instance, attributes) {
        attributes = new BelongsToAttributes(attributes, this);

        if (attributes.referencesOwner()) {
          instance[associationName] = attributes["findOwnerBy" + attributes.ownerReference().classify()]();
          addInverseAssociation();
        }

        function addInverseAssociation() {
          if (!inverse()) { inverseAssociation.instantiate(instance[associationName], {}); }
          instance[associationName][inverseAssociation().associationName].add(instance);
        }

        function inverse() {
          return instance[associationName][inverseAssociation().associationName];
        }

        function inverseAssociation() {
          return instance[associationName].constructor.associations
                                          .where({klass: instance.constructor}).first();
        }
      }

      this.options         = options;
      this.associationName = associationName;
      this.foreignKey      = getForeignKey();

      Object.defineProperty(this, 'klass', {
        enumerable: true,
        get: function() { return this.getClass(); }
      });

      function getForeignKey() {
        return options.foreignKey ? options.foreignKey : associationName.toForeignKey();
      }
    }

    return BelongsTo;
  }]);
