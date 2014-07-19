angular
  .module('Mocks')
  .factory('ARHat', ['ngActiveResource', function(ngActiveResource) {

    Hat.inherits(ngActiveResource.Base);

    function Hat() {
    }

    Hat.belongsTo("person", {foreignKey: "user_id"});
    Hat.belongsTo("collection", {provider: "ARCollection"});

    return Hat;

  }]);

