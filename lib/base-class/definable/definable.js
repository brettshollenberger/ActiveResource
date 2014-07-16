angular
  .module('BaseClass')
  .factory('BCDefinable', [function() {
    function Definable() {
      this.__string = function(propertyName) {
        this[propertyName] = this.constructor.attributes[propertyName];
      }

      this.__integer = function(propertyName) {
        this[propertyName] = this.constructor.attributes[propertyName];
      }

      this.__number = function(propertyName) {
        this[propertyName] = this.constructor.attributes[propertyName];
      }

      this.__boolean = function(propertyName) {
        this[propertyName] = this.constructor.attributes[propertyName];
      }
    }

    return Definable;
  }]);
