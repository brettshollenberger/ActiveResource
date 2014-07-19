angular
  .module('ngActiveResource')
  .factory('ARPrimaryKey', [function() {
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
