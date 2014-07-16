angular
  .module('BaseClass')
  .factory('BCBase', ['BCCacheable', 'BCValidatable', 'BCErrorable', 
  'BCPrimaryKeyable', 'BCDefinable', 'BCMime.XML',
  function(Cacheable, Validatable, Errorable, PrimaryKeyable, Definable, XML) {
    function Base(attributes) {
      var _constructor = this;
      var _prototype   = _constructor.prototype;

      _constructor.new = function(attributes) {
        _constructor.attributes = attributes;
        var instance = new _constructor(attributes);
        _constructor.cache(instance);
        delete _constructor.attributes;
        return instance;
      };

      _constructor.extend(Cacheable);
      _constructor.extend(Validatable);
      _constructor.extend(PrimaryKeyable);
      _constructor.include(Validatable);
      _constructor.include(Errorable);
      _constructor.include(Definable);
    };

    return Base;
  }]);
