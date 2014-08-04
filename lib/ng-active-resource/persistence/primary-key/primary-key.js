angular
  .module('ngActiveResource')
  .factory('ARPrimaryKey', [function() {

    PrimaryKey.extended = function(klass) {
      klass.during("new", function(instance, attributes) {
        instance.integer(klass.primaryKey);

        privateVariable(instance, 'hasPrimaryKey', function() {
          return !_.isUndefined(instance[klass.primaryKey]) && !_.isNull(instance[klass.primaryKey]);
        });
      });
    }

    function PrimaryKey() {
      var primaryKey = 'id';

      Object.defineProperty(this, 'primaryKey', {
        configurable: true,
        get: function()      { return primaryKey; },
        set: function(value) { primaryKey = value; }
      });
    }

    return PrimaryKey;
  }]);
