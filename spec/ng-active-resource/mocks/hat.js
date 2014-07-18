angular
  .module('Mocks')
  .factory('ARHat', ['ngActiveResource', function(ngActiveResource) {

    Hat.inherits(ngActiveResource.Base);

    function Hat() {
      this.belongsTo("person", {foreignKey: "user_id"});
      this.belongsTo("collection", {provider: "ARCollection"});
    }

    return Hat;

  }]);

