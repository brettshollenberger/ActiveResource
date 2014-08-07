angular
  .module('ngActiveResource')
  .factory('ARSerializeAssociations', ['Foreignkeyify', 'DropHasMany', function(foreignkeyify, dropHasMany) {

    return function serializeAssociations(instance, reflections) {
      var reflections = (reflections || instance.constructor.reflections).clone(),
          clone       = _.cloneDeep(instance);

      clone = foreignkeyify(clone, reflections);
      clone = dropHasMany(clone, reflections);

      return clone;
    }

  }]);
