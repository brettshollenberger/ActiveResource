angular
  .module('ngActiveResource')
  .factory('AREventable', ['ARMixin', 'ARFunctional.Collection', 
  function(mixin, FunctionalCollection) {

    function Eventable() {
      var events = {handlers: {}};

      Object.defineProperty(this, 'emit', {
        enumerable: true,
        configurable: true,
        value: function(eventType) {
          if (!events.handlers[eventType]) return;
          var handlerArgs = Array.prototype.slice.call(arguments, 1);

          _.each(events.handlers[eventType], function(handler) {
            new EventRunner(this, eventType, handler, handlerArgs).run();
          }, this);

          return events;
        }
      });

      function addAspect(eventType, handler) {
        if (!(eventType in events.handlers)) {
          events.handlers[eventType] = mixin([], FunctionalCollection);
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

      function EventRunner(context, eventType, handler, handlerArgs) {
        privateVariable(context, 'unbind', function() {
          events.handlers[eventType].$reject(function(h) { return h == handler; });
        });

        privateVariable(context, 'rebindTo', function(otherObject) {
          context.unbind();
          otherObject.on(eventType, handler);
        });

        return {
          run: function() {
            handler.apply(context, handlerArgs);
            delete context.unbind;
            delete context.rebindTo;
          }
        }
      }
    };

    return Eventable;

  }]);
