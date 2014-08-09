angular
  .module('Mocks')
  .factory('Player', ['ngActiveResource', function(ngActiveResource) {

    Player.inherits(ngActiveResource.Base);

    Player.hasMany("ships");

    function Player(attributes) {
      this.computedProperty("lost", function() {
        return !!(this.ships.length && this.ships.all(function(ship) {
          return ship.sunk;
        }));
      }, "ships");
    };

    return Player;
  }]);
