angular
  .module('Mocks')
  .factory('Player', ['ngActiveResource', function(ngActiveResource) {

    Player.inherits(ngActiveResource.Base);

    Player.hasMany("ships");

    function Player(attributes) {
      this.computedProperty("lost", function() {
        if (this.ships.length == 0) { return false; }

        return this.ships.all(function(ship) {
          return ship.sunk;
        });
      }, "ships.sunk");
    };

    return Player;
  }]);
