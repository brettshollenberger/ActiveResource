angular
  .module('ngActiveResource')
  .factory('ARBase', ['ARCacheable', 'ARValidatable', 'ARErrorable', 
  'ARPrimaryKeyable', 'ARDefinable', 'ARComputedProperty',
  'ARMime.Formattable', 'ARAPI', 'ARFindable', 'ARDeserializable', 'ARSerializable',
  'AREventable',
  function(Cacheable, Validatable, Errorable, PrimaryKeyable, Definable, ComputedProperty,
    Formattable, API, Findable, Deserializable, Serializable, Eventable) {
    function Base(attributes) {
      var constructor = this;
      var prototype   = constructor.prototype;

      constructor.extend(API);
      constructor.extend(Cacheable);
      constructor.extend(Deserializable);
      constructor.extend(Serializable);
      constructor.extend(Eventable);
      constructor.extend(Findable);
      constructor.extend(Validatable);
      constructor.extend(PrimaryKeyable);
      constructor.include(Formattable);
      constructor.include(Validatable);
      constructor.include(Errorable);
      constructor.include(Definable);
      constructor.include(ComputedProperty);

      constructor.new = function(attributes) {
        constructor.emit("new:called", attributes);
        var instance = new constructor(attributes);
        constructor.cache(instance);
        constructor.emit("new:complete", instance)
        return instance;
      };

    };

    return Base;
  }]);
