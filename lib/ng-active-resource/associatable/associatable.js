angular
  .module('ngActiveResource')
  .factory('ARAssociatable', ['ARAssociatable.Associations', 'ARAssociatable.HasMany.Builder', 
    'ARAssociatable.BelongsTo.Builder',
    function(Associations, HasManyBuilder, BelongsToBuilder) {

    Associatable.included = function(klass) {
      klass.associations = new Associations();

      klass.prototype.hasMany = function(associationName, options) {
        HasManyBuilder.build(klass, associationName, options);
      }

      klass.prototype.belongsTo = function(associationName, options) {
        BelongsToBuilder.build(klass, associationName, options);
      }
    }

    function Associatable() {
    }

    return Associatable;
  }]);
