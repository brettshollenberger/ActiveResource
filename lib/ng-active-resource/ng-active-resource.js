angular
  .module('ngActiveResource', [])
  .factory('ngActiveResource', ['ARAPI', 'ARBase', 'ARConfigurable', 'ARDirty', 'ARWatchable', 
  'ARRefinable',
  function(API, Base, Configurable, Dirty, Watchable, Refinable) {
    ngActiveResource              = {};

    ngActiveResource.api          = API;
    ngActiveResource.Base         = Base;
    ngActiveResource.Configurable = Configurable;
    ngActiveResource.Dirty        = Dirty;
    ngActiveResource.Watchable    = Watchable;
    ngActiveResource.Refinable    = Refinable;

    return ngActiveResource;
  }]);

Function.prototype.inherits = function(baseclass) {
  var _constructor = this;
  _constructor = baseclass.apply(_constructor);
};

Function.prototype.extend = function(Module, options) {
  var properties     = new Module(),
      options        = options || {},
      propertyNames  = Object.getOwnPropertyNames(properties),
      classPropNames = _.remove(propertyNames, function(propName) {
                          return propName.slice(0, 2) != '__';
                       });

  _.each(classPropNames, function(cpn) {
    var propertyDescriptor = _.clone(Object.getOwnPropertyDescriptor(properties, cpn));

    if (options.private) { propertyDescriptor.enumerable = false; }

    Object.defineProperty(this, cpn, propertyDescriptor);
  }, this);

  if (_.isFunction(Module.extended)) {
    Module.extended(this);
  }
};

Object.defineProperty(Object.prototype, 'extend', {
  enumerable: false,
  configurable: true,
  value: Function.prototype.extend
});

Function.prototype.include = function(Module) {
  var methods           = new Module(),
      propNames         = Object.getOwnPropertyNames(methods),
      instancePropNames = _.remove(propNames, function(val) {
                            return val.slice(0, 2) == '__';
                          });

  _.each(instancePropNames, function(ipn) {
    var propDescriptor = Object.getOwnPropertyDescriptor(methods, ipn);
    Object.defineProperty(this.prototype, ipn.slice(2), propDescriptor);
  }, this);

  if (_.isFunction(Module.included)) {
    Module.included(this);
  }
};

function privateVariable(object, name, value) {
  var val;
  Object.defineProperty(object, name, {
    enumerable: false,
    configurable: true,
    get: function()       { return val; },
    set: function(newval) { val = newval; }
  });

  if (value !== undefined) object[name] = value;
};

Object.defineProperty(Array.prototype, 'nodupush', {
  enumerable: false,
  configurable: true,
  value: function(val) {
    if (!_.include(this, val)) this.push(val);
  }
});
