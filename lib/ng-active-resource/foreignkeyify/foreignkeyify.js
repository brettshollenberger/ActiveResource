angular
  .module('ngActiveResource')
  .factory('ARForeignKeyify', [function() {

    return function foreignKeyify(instance) {
      var reflections = instance.constructor.reflections,
          instance    = _.cloneDeep(instance);

      return _.transform(reflections, function(keyified, reflection) {
        if (reflection.foreignKey && instance[reflection.name]) {
          instance[reflection.foreignKey] = instance[reflection.name][reflection.associationPrimaryKey()];
          delete instance[reflection.name];
        }
      }, instance);
    }

  }]);
