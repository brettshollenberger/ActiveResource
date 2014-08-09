angular
  .module('ngActiveResource')
  .factory('AREventable.Array', ['AREventable', function(Eventable) {

    function EventableArray(array) {
      this.extend(Eventable, {private: true});

      this.push = function() {
        this.emit("push", arguments);
        return Array.prototype.push.apply(this, arguments);
      }

      this.pop = function() {
        var popped = Array.prototype.pop.apply(this);
        this.emit("pop", popped);
        return popped;
      }
    }

    return EventableArray;

  }]);
