angular
  .module('ngActiveResource')
  .factory('ARAssociatable.Associations', [function() {
    function Associations() {
      this.hasMany   = {};
      this.belongsTo = {};
    }

    return Associations;
  }]);

