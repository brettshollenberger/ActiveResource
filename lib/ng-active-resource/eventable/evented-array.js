angular
  .module('ngActiveResource')
  .factory('AREventable.Array', ['AREventable', function(Eventable) {

    function EventableArray(array) {
      this.extend(Eventable, {private: true});

      this.push=(function() {
        var original = Array.prototype.push;

        return function() {
          this.emit("push", arguments);
          return original.call(this, arguments);
        }
      })();

      this.pop=(function() {
        var original = Array.prototype.pop;

        return function() {
          var popped = original.apply(this);
          this.emit('pop', popped);
          return popped;
        }
      })();
    }

    return EventableArray;

  }]);
