angular
  .module('ngActiveResource')
  .factory('ARAssociatable', ['ARAssociatable.Associations', 'ARAssociatable.HasMany.Builder', 
    'ARAssociatable.BelongsTo.Builder',
    function(Associations, HasManyBuilder, BelongsToBuilder) {

    Associatable.included = function(klass) {
      klass.associations = new Associations();

      klass.hasMany = function(associationName, options) {
        HasManyBuilder.build(klass, associationName, options);
      }

      klass.belongsTo = function(associationName, options) {
        BelongsToBuilder.build(klass, associationName, options);
      }

      klass.during("new", setAssociations);
      klass.before("update", setAssociations);

      function setAssociations(instance, attributes) {
        _.each(klass.associations, function(association) {
          association.instantiate(instance, attributes);
        });
      }
    }

    function Associatable() {}

    return Associatable;
  }]);
