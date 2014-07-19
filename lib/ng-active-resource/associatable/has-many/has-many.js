angular
  .module('ngActiveResource')

  .factory('ARAssociatable.HasMany.Builder', ['ARAssociatable.HasMany', function(HasMany) {
    function Builder() {}

    Builder.build = function(klass, associationName, options) {
      var name    = associationName.pluralize().downcase(),
          options = _.isUndefined(options) ? {} : options;

      if (_.isUndefined(klass.associations.hasMany[name])) {
        return klass.associations.hasMany[name] = new HasMany(klass, name, options);
      }
    }

    return Builder;
  }])

  .factory('ARAssociatable.HasMany', ['ARAssociatable.Association', 
  function(Association) {

    HasMany.include(Association);

    function HasMany(klass, associationName, options) {
      this.options         = options;
      this.associationName = associationName;

      Object.defineProperty(this, 'klass', {
        enumerable: true,
        get: function() { return this.getClass(); }
      });
    }

    return HasMany;
  }]);
