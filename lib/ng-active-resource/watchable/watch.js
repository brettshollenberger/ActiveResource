angular
  .module('ngActiveResource')
  .factory('ARWatchable.Watch', ['AREventable.Array', function(EventableArray) {

    function watch(obj, propName, fn) {
      if (_.isUndefined(obj)) { return; }

      if (fn === void 0 && typeof propName == 'function') {
        fn       = propName;
        propName = undefined;
      }

      if (_.isFunction(obj.push)) {
        watchArray(obj, fn);
        return;
      }
      if (propName) {
        if (propName.constructor.name == 'String') {
          watchProperty(obj, propName, fn);
          return;
        }
      }
      for (var i in obj) {
        watchProperty(obj, i, fn);
      }
    }

    function watchArray(array, fn) {
      array = mixin(array, EventableArray);

      array.on("push", function(newElements) {
        _.each(newElements, function(newElement) {
          watch(newElement, fn);
          fn(newElement, array);
        });
      });

      array.on('pop', function(removedElement) {
        fn(removedElement, array);
      });
    }

    function watchProperty(obj, propName, fn) {
      var s = obj.__lookupSetter__(propName);
      var g = obj.__lookupGetter__(propName);
      var currentVal;
      if (obj[propName]) currentVal = obj[propName];
      (function(obj, propName, fn) {
          var val = currentVal;
          if (!s && !g) {
              s = function(v) { return val = v; }
              g = function()  { return val; }
          }

          obj.__defineSetter__(propName, function(value) {
              var ret = s(value);
              fn(ret, obj, propName);
              return val;
          });
          obj.__defineGetter__(propName, g);
      })(obj, propName, fn);
    }

    return watch;

  }]);
