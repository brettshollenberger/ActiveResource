angular
  .module('ngActiveResource')
  .factory('ARBase', ['ARCacheable', 'ARValidatable', 'ARErrorable', 
  'ARPrimaryKeyable', 'ARDefinable', 'ARComputedProperty',
  'ARMime.Formattable', 'ARAPI', 'ARFindable', 'ARDeserializable', 'ARSerializable',
  'AREventable',
  function(Cacheable, Validatable, Errorable, PrimaryKeyable, Definable, ComputedProperty,
    Formattable, API, Findable, Deserializable, Serializable, Eventable) {
    function Base(attributes) {
      var _constructor = this;
      var _prototype   = _constructor.prototype;

      _constructor.extend(API);
      _constructor.extend(Cacheable);
      _constructor.extend(Deserializable);
      _constructor.extend(Serializable);
      _constructor.extend(Eventable);
      _constructor.extend(Findable);
      _constructor.extend(Validatable);
      _constructor.extend(PrimaryKeyable);
      _constructor.include(Formattable);
      _constructor.include(Validatable);
      _constructor.include(Errorable);
      _constructor.include(Definable);
      _constructor.include(ComputedProperty);

      _constructor.before("new", function(attributes) {
        _constructor.constructing = { attributes: attributes }
      });

      _constructor.new = function(attributes) {
        _constructor.emit("new:called", attributes);
        var instance = new _constructor(attributes);
        _constructor.cache(instance);
        _constructor.emit("new:complete", instance)
        return instance;
      };

      _constructor.after("new", function(instance) {
        delete _constructor.constructing;
      });

    };

    return Base;
  }]);
