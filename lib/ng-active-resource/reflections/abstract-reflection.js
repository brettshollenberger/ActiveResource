angular
  .module('ngActiveResource')
  .factory('ARReflections.AbstractReflection', ['$injector', function($injector) {
    function AbstractReflection(name, options) {
      this.name        = name;
      this.options     = options;
      this.macro       = options.macro;
      this.isBelongsTo = macroIs("belongsTo");
      this.isHasMany   = macroIs("hasMany");
      this.foreignKey  = options.foreignKey || deriveForeignKey.call(this);

      this.associationPrimaryKey = function() {
        return options.primaryKey || this.klass.primaryKey;
      }

      this.inverse = function() {
        return this.klass.reflections.where({klass: this.inverseKlass()}).first();
      }

      this.inverseKlass = function() {
        return options.inverseOf;
      }

      this.containsAssociation = function(object) {
        return !_.isUndefined(object[this.name]);
      }

      this.containsForeignKey = function(object) {
        return _.chain(object)
                .keys()
                .include(this.foreignKey)
                .value();
      }

      this.initializeFor = function(instance, value) {
        instance[this.name] = value;
        return instance;
      }

      Object.defineProperty(this, 'klass', {
        enumerable: true,
        get: function() { return getClass.call(this); }
      });

      function deriveForeignKey() {
        if (this.isBelongsTo()) { return name.toForeignKey(); }
      }

      function getClass() {
        return this.options.provider ? get(this.options.provider) : 
                                       get(guessClassName.call(this));
      }

      function get(providerName) {
        if (!!cached(providerName)) { return cached(providerName); }

        cache(providerName);
        return get(providerName);
      }

      function cached(providerName) {
        return AbstractReflection.models[providerName];
      }

      function cache(providerName) {
        AbstractReflection.models[providerName] = $injector.get(providerName);
      }

      function guessClassName() {
        return this.name.classify();
      }

      function macroIs(macroName) {
        return function() {
          return this.macro == macroName;
        }
      }
    }

    AbstractReflection.models = {};

    return AbstractReflection;
  }]);
