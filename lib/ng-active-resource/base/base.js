'use strict';

angular
  .module('ngActiveResource')
  .factory('ARBase', ['AREventable', 'ARCreatable', 'ARUpdatable', 'ARSaveable', 'ARQueryable',
  'ARFindable', 'ARSerializable', 'ARDeserializable',
  'ARValidatable', 'ARPrimaryKey', 'ARAPI', 'ARAssociatable', 'ARCacheable', 'ARErrorable', 
  'ARMime.Formattable', 'ARDefinable', 'ARComputedProperty', 'ARFunctional', 'ARPromiseable',
  'ARReflections',
  function(Eventable, Creatable, Updatable, Saveable, Queryable, Findable, Serializable, 
    Deserializable, Validatable, PrimaryKey, API, Associatable, Cacheable, Formattable, Errorable, 
    Definable, ComputedProperty, Functional, Promiseable, Reflections) {

    function Base(attributes) {
      this.extend(Eventable);
      this.extend(Creatable);
      this.extend(Queryable);
      this.extend(Findable);
      this.extend(Serializable);
      this.extend(Deserializable);
      this.extend(Validatable);
      this.extend(PrimaryKey);

      this.include(Updatable);
      this.include(Saveable);
      this.include(API);
      this.include(Associatable);
      this.include(Reflections);
      this.include(Cacheable);
      this.include(Formattable);
      this.include(Validatable);
      this.include(Errorable);
      this.include(Definable);
      this.include(ComputedProperty);
      this.include(Functional);
      this.include(Promiseable);
    }

    return Base;
  }]);
