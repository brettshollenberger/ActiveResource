angular
  .module('ngActiveResource')
  .factory('ARBase', ['ARCacheable', 'ARValidatable', 'ARErrorable', 
  'ARPrimaryKeyable', 'ARDefinable', 'ARComputedProperty',
  'ARMime.Formattable',
  function(Cacheable, Validatable, Errorable, PrimaryKeyable, Definable, ComputedProperty,
    Formattable) {
    function Base(attributes) {
      var _constructor = this;
      var _prototype   = _constructor.prototype;

      _constructor.new = function(attributes) {
        _constructor.constructing = { attributes: attributes };
        var instance = new _constructor(attributes);
        _constructor.cache(instance);
        delete _constructor.constructing;
        return instance;
      };

      _constructor.extend(Cacheable);
      _constructor.extend(Validatable);
      _constructor.extend(PrimaryKeyable);
      _constructor.include(Formattable);
      _constructor.include(Validatable);
      _constructor.include(Errorable);
      _constructor.include(Definable);
      _constructor.include(ComputedProperty);
    };

    return Base;
  }]);
