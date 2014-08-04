angular
  .module('ngActiveResource')
  .factory('ARSerializeAssociations', ['Foreignkeyify', 'DropHasMany', function(foreignkeyify, dropHasMany) {

    return function serializeAssociations(instance) {
      var reflections = instance.constructor.reflections,
          clone       = _.cloneDeep(instance);

      clone = foreignkeyify(clone, reflections);
      clone = dropHasMany(clone, reflections);

      return clone;
    }

  }]);
