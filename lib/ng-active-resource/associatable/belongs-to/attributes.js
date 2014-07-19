// A belongsTo association will either reference its owner by name or foreign key
//
//    // by name
//    comment.update({post: post});
//
//    // by foreign key
//    comment.update({post_id: 1});
//
// The BelongsTo.Attributes module parses attributes passed to a belongs to association for these references,
// and finds the association if possible.
angular
  .module('ngActiveResource')
  .factory('ARAssociatable.BelongsTo.Attributes', [function() {

    function BelongsToAttributes(attributes, association) {
      var attrs = _.cloneDeep(attributes);

      attrs.referencesOwner = function() {
        return attrs.name() || attrs.foreignKey();
      }

      attrs.ownerReference = function() {
        return _.chain(["name", "foreignKey"])
                .select(function(ref) { return !!attrs[ref](); })
                .first()
                .value();
      }

      attrs.name = function() {
        return attributes[association.associationName];
      }

      attrs.foreignKey = function() {
        return attributes[association.foreignKey];
      }

      attrs.findOwnerByName = function() {
        return attrs.name();
      }

      attrs.findOwnerByForeignKey = function() {
        return association.klass.cached.find(attributes[association.foreignKey]);
      }

      return attrs;
    }

    return BelongsToAttributes;

  }]);
