// Comment { post: { id: 1, title: "My Great Title" } }
// => Comment { post_id: 1 }

angular
  .module('ngActiveResource')
  .factory('Foreignkeyify', [function() {
    return function foreignkeyify(instance, reflections) {
      var reflections = reflections || instance.constructor.reflections,
          clone       = _.cloneDeep(instance);

      return _.transform(reflections, function(keyified, reflection) {
        if (reflection.foreignKey && clone[reflection.name]) {
          clone[reflection.foreignKey] = clone[reflection.name][reflection.associationPrimaryKey()];
          delete clone[reflection.name];
        }
      }, clone);
    }
  }]);
