angular
  .module('ActiveResource')
  .provider('ARBase', function() {
    this.$get = ['ARDefault', 'ARCache', 'ARAPI', 'ARValidations', function(defaultTo, Cache, API, Validations) {
      function Base() {
        var _constructor = this;
        var _prototype   = _constructor.prototype;

        _constructor.cached = new Cache();
        privateVariable(_constructor, 'primaryKey', 'id');
        _constructor.api    = new API(_constructor, _constructor.primaryKey);

        function cache(instance) {
          _constructor.cached.cache(instance, _constructor.primaryKey);
        }

        _constructor.new = function(attributes) {
          attributes   = defaultTo.emptyObject(attributes);
          var instance = new _constructor(attributes);
          addValidations(instance);
          cache(instance);
          return instance;
        }
      };

      return Base;
    }];
  })
