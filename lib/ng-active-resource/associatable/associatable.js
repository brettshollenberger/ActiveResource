angular
  .module('ngActiveResource')
  .factory('ARAssociatable', ['ARAssociatable.Associations', 'ARAssociatable.HasMany.Builder', 
    function(Associations, HasManyBuilder) {

    Associatable.included = function(klass) {
      klass.associations = new Associations();

      klass.hasMany = function(associationName, options) {
        HasManyBuilder.build(klass, associationName, options);
      }
    }

    function Associatable() {
    }

    return Associatable;
  }]);
