(function() {
  angular
    .module('ngActiveResource')
    .factory('ARSet', ['ARStrictRequire', function(strictRequire) {
      function Set() {
        var set = {};

        privateVariable(set, 'find', 
          function(item) { 
            return set[item]; 
          }
        );

        privateVariable(set, 'add',
          function(attributes) {
            strictRequire(attributes, ['key', 'value']);
            ensureUniqueKey(attributes.key, attributes.error);
            set[attributes.key] = attributes.value;
          }
        );

        function ensureUniqueKey(key, error) {
          var error = error || 'Key already exists in set';

          if (set[key] !== undefined) {
            throw {
              name: 'DuplicateSetKeyError',
              message: error
            }
          }
        };

        return set;
      };

      return Set;
    }])
})();
