angular
  .module('ngActiveResource')
  .factory('ARAssociatable.BelongsTo.Builder', ['ARAssociatable.BelongsTo', 
  function(BelongsTo) {
    function Builder() {}

    Builder.build = function(klass, associationName, options) {
      var name    = associationName.singularize().downcase(),
          options = _.isUndefined(options) ? {} : options;

      if (_.isUndefined(klass.associations.belongsTo[name])) {
        return klass.associations.belongsTo[name] = new BelongsTo(klass, name, options);
      }
    }

    return Builder;
  }])

  .factory('ARAssociatable.BelongsTo', ['ARAssociatable.Association', 
  function(Association) {

    BelongsTo.include(Association);

    function BelongsTo(klass, associationName, options) {
      this.options         = options;
      this.associationName = associationName;
      this.klass           = this.getClass();
      this.foreignKey      = getForeignKey();

      function getForeignKey() {
        return options.foreignKey ? options.foreignKey : associationName.toForeignKey();
      }
    }

    return BelongsTo;
  }]);
