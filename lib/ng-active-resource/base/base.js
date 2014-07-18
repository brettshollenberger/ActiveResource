angular
  .module('ngActiveResource')
  .factory('ARBase', ['ARCacheable', 'ARValidatable', 'ARErrorable', 
  'ARPrimaryKeyable', 'ARDefinable', 'ARComputedProperty',
  'ARMime.Formattable', 'ARAPI', 'ARFindable', 'ARDeserializable', 'ARSerializable',
  'AREventable', 'ARAssociatable',
  function(Cacheable, Validatable, Errorable, PrimaryKeyable, Definable, ComputedProperty,
    Formattable, API, Findable, Deserializable, Serializable, Eventable, Associatable) {
    function Base(attributes) {
      var constructor = this;
      var prototype   = constructor.prototype;

      constructor.extend(Serializable);
      constructor.extend(Deserializable);
      constructor.extend(Eventable);
      constructor.extend(Findable);
      constructor.extend(Validatable);
      constructor.extend(PrimaryKeyable);
      constructor.include(API);
      constructor.include(Associatable);
      constructor.include(Cacheable);
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
