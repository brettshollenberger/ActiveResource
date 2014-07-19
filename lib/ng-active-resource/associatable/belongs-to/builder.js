angular
  .module('ngActiveResource')
  .factory('ARAssociatable.BelongsTo.Builder', ['ARAssociatable.BelongsTo', 
  function(BelongsTo) {
    function Builder() {}

    Builder.build = function(klass, associationName, options) {
      var name    = associationName.singularize().downcase(),
          options = _.isUndefined(options) ? {} : options;

      if (_.isUndefined(klass.associations[name])) {
        return klass.associations[name] = new BelongsTo(klass, name, options);
      }
    }

    return Builder;
  }])

