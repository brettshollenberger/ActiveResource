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
