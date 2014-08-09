angular
  .module('Mocks')
  .factory('Ship', ['ngActiveResource', function(ngActiveResource) {

    Ship.inherits(ngActiveResource.Base);

    Ship.belongsTo("player");

    function Ship(attributes) {
      this.string("state");

      this.computedProperty("sunk", function() {
        return this.state == "sunk";
      }, "state");
    };

    return Ship;
  }]);
