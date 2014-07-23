angular
  .module('ngActiveResource')
  .factory('ARReflections', ['ARReflections.HasManyReflection', 'ARReflections.BelongsToReflection', 
  function(HasManyReflection, BelongsToReflection) {

    Reflections.included = function(klass) {
      privateVariable(klass, "reflections", new Reflections(klass));

      klass.hasMany   = reflectionMacro("hasMany");
      klass.belongsTo = reflectionMacro("belongsTo");

      function reflectionMacro(macro) {
        return function(associationName, options) {
          return klass.reflections.create(macro, associationName, options);
        }
      }
    }

    function Reflections(klass) {
      privateVariable(this, 'klass', klass);

      privateVariable(this, 'create', function(macro, name, options) {
        var MacroClass;

        switch (macro) {
          case "hasMany":
            MacroClass = HasManyReflection;
            break;

          case "belongsTo":
            MacroClass = BelongsToReflection;
            break;

          default:
            throw "Unsupported macro " + macro;
        }

        klass.reflections[name] = new MacroClass(name, options);
      });
    }

    return Reflections;
  }]);
