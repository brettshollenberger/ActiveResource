'use strict';

angular
  .module('ngActiveResource')
  .factory('ARBase', ['AREventable', 'ARCreatable', 'ARUpdatable', 'ARSaveable', 'ARQueryable',
  'ARFindable', 'ARDeletable', 'ARSerializable', 'ARDeserializable',
  'ARValidatable', 'ARPrimaryKey', 'ARWatchable', 'ARDirty', 'ARAPI', 'ARAssociatable', 'ARCacheable',
  'ARErrorable', 'ARMime.Formattable', 'ARDefinable', 'ARComputedProperty', 'ARFunctional', 
  'ARPromiseable', 'ARReflections',
  function(Eventable, Creatable, Updatable, Saveable, Queryable, Findable, Deletable, Serializable,
    Deserializable, Validatable, PrimaryKey, Watchable, Dirty, API, Associatable, Cacheable, 
    Formattable, Errorable, Definable, ComputedProperty, Functional, Promiseable, Reflections) {

    function Base(attributes) {
      this.extend(Eventable);
      this.extend(Creatable);
      this.extend(Queryable);
      this.extend(Findable);
      this.extend(Serializable);
      this.extend(Deserializable);
      this.extend(Validatable);
      this.extend(PrimaryKey);
      this.extend(Watchable);
      this.extend(Dirty);

      this.include(Updatable);
      this.include(Saveable);
      this.include(Deletable);
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
      this.include(Eventable);
    }

    return Base;
  }]);
