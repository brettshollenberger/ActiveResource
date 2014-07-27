angular
  .module('ngActiveResource')
  .factory('AREventable', [function() {

    function Eventable() {
      var events = {handlers: {}};

      Object.defineProperty(this, 'emit', {
        enumerable: true,
        value: function(eventType) {
          if (!events.handlers[eventType]) return;
          var handlerArgs = Array.prototype.slice.call(arguments, 1);

          _.each(events.handlers[eventType], function(handler) {
            handler.apply(this, handlerArgs);
          }, this);

          return events;
        }
      });

      function addAspect(eventType, handler) {
        if (!(eventType in events.handlers)) {
          events.handlers[eventType] = [];
        }
        events.handlers[eventType].push(handler);
        return this;
      };

      this.on = function(eventType, handler) {
        return addAspect(eventType, handler);
      }

      this.before = function(eventType, handler) {
        return addAspect(eventType + ':called', handler);
      };

      this.during = function(eventType, handler) {
        return addAspect(eventType + ':beginning', handler);
      };

      this.data = function(eventType, handler) {
        return addAspect(eventType + ':data', handler);
      };

      this.after = function(eventType, handler) {
        return addAspect(eventType + ':complete', handler);
      };

      this.fail  = function(eventType, handler) {
        return addAspect(eventType + ':fail', handler);
      };
    };

    return Eventable;

  }]);
