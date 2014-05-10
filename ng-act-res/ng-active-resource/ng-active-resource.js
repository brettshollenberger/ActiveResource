Function.prototype.inherits = function(base) {
  var _constructor;
  _constructor = this;
  return _constructor = base.apply(_constructor);
};

function privateVariable(object, name, value) {
  var val;
  Object.defineProperty(object, name, {
    enumerable: false,
    configurable: false,
    get: function()       { return val; },
    set: function(newval) { val = newval; }
  });

  if (value !== undefined) object[name] = value;
};

Object.defineProperty(Array.prototype, 'first', {
  enumerable: false,
  configurable: false,
  get: function() { return this[0]; }
});

Object.defineProperty(Array.prototype, 'last', {
  enumerable: false,
  configurable: false,
  get: function() { if (this.slice(-1).length) return this.slice(-1)[0]; }
});

Object.defineProperty(Array.prototype, 'nodupush', {
  enumerable: false,
  configurable: true,
  value: function(val) {
    if (!_.include(this, val)) this.push(val);
  }
});

angular
  .module('ActiveResource', ['ng', 'dojo'])
  .provider('ActiveResource', function() {
    this.$get = ['ARBase', function(Base) {
      ActiveResource      = {};
      ActiveResource.Base = Base;
      return ActiveResource;
    }];
  });
