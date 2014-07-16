angular
  .module('BaseClass')
  .factory('BCPrimaryKeyable', [function() {
    function PrimaryKeyable() {
      var primaryKey = 'id';

      Object.defineProperty(this, 'primaryKey', {
        configurable: true,
        get: function()      { return primaryKey; },
        set: function(value) { primaryKey = value; }
      });
    }

    return PrimaryKeyable;
  }]);
