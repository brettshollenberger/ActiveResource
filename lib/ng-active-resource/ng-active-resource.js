Function.prototype.inherits = function(baseclass) {
  var _constructor = this;
  _constructor = baseclass.apply(_constructor);
};

Function.prototype.extend = function(Module) {

  var properties     = new Module(),
      propertyNames  = Object.getOwnPropertyNames(properties),
      classPropNames = _.remove(propertyNames, function(propName) {
                          return propName.slice(0, 2) != '__';
                       });

  _.each(classPropNames, function(cpn) {
    var propertyDescriptor = Object.getOwnPropertyDescriptor(properties, cpn);

    Object.defineProperty(this, cpn, propertyDescriptor);
  }, this);

};

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

angular
  .module('ngActiveResource', [])
  .factory('ngActiveResource', ['ARBase', function(Base) {
    ngActiveResource      = {};
    ngActiveResource.Base = Base;
    return ngActiveResource;
  }]);
