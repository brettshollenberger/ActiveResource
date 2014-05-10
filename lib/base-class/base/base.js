angular
  .module('BaseClass')
  .factory('BCBase', ['BCCacheable', 'BCValidatable', 'BCErrorable', 
  function(Cacheable, Validatable, Errorable) {
    function Base(attributes) {
      var _constructor = this;
      var _prototype   = _constructor.prototype;
      privateVariable(_constructor, 'primaryKey', 'id');

      _constructor.new = function(attributes) {
        var instance = new _constructor(attributes);
        _constructor.cache(instance);
        return instance;
      };

      _constructor.extend(Cacheable);
      _constructor.extend(Validatable);
      _constructor.include(Validatable);
      _constructor.include(Errorable);
    };

    return Base;
  }]);
