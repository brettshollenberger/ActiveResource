angular
  .module('ngActiveResource')
  .factory('ARReflections.AbstractReflection', ['$injector', function($injector) {
    function AbstractReflection(name, options) {
      this.name       = name;
      this.options    = options;
      this.foreignKey = options.foreignKey || deriveForeignKey();

      this.associationPrimaryKey = function() {
        return options.primaryKey || this.klass.primaryKey;
      }

      this.inverse = function() {
        return this.klass.reflections.where({klass: this.inverseKlass()}).first();
      }

      this.inverseKlass = function() {
        return options.inverseOf;
      }

      Object.defineProperty(this, 'klass', {
        enumerable: true,
        get: function() { return getClass.call(this); }
      });

      function belongsTo() {
        return options.macro == "belongsTo";
      }

      function deriveForeignKey() {
        if (belongsTo()) { return name.toForeignKey(); }
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
    }

    AbstractReflection.models = {};

    return AbstractReflection;
  }]);
