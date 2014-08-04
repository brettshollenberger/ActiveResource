angular
  .module('ngActiveResource')
  .factory('DropHasMany', [function() {
    return function DropHasMany(instance, reflections) {
      var reflections = reflections || instance.constructor.reflections,
          clone       = _.cloneDeep(instance);

      reflections.select(function(reflection) { return reflection.macro == "hasMany"; })
                 .each(function(reflection) {
                    delete clone[reflection.name];
                 });

      return clone;
    }
  }]);
