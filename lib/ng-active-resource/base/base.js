'use strict';

angular
  .module('ngActiveResource')
  .factory('ARBase', ['ARCreatable', 'ARFindable', 'AREventable', 'ARSerializable', 'ARDeserializable',
  'ARValidatable', 'ARPrimaryKey', 'ARAPI', 'ARAssociatable', 'ARCacheable', 'ARErrorable', 
  'ARMime.Formattable', 'ARDefinable', 'ARComputedProperty', 'ARFunctional',
  function(Creatable, Findable, Eventable, Serializable, Deserializable, Validatable, PrimaryKey, API,
    Associatable, Cacheable, Formattable, Errorable, Definable, ComputedProperty, Functional) {

    function Base(attributes) {
      this.extend(Creatable);
      this.extend(Findable);
      this.extend(Eventable);
      this.extend(Serializable);
      this.extend(Deserializable);
      this.extend(Validatable);
      this.extend(PrimaryKey);

      this.include(API);
      this.include(Associatable);
      this.include(Cacheable);
      this.include(Formattable);
      this.include(Validatable);
      this.include(Errorable);
      this.include(Definable);
      this.include(ComputedProperty);
      this.include(Functional);
    }

    return Base;
  }]);
