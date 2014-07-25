// Reflections
//
// Reflections represent the meta-information about associations between classes.
//
// Classes return their reflections as a hash:
//
//    Post.hasMany("comments");
//
//    Post.reflections =>
//    {
//      comments: {
//        macro:                  "hasMany"                 // the name of the relationship
//        klass:                  Comment,                  // the class of the association
//        foreignKey:             undefined,                // hasMany associations have none
//        #associationPrimaryKey: "id",                     // the primary key of the Comment class
//        #inverse:               Comment.reflections.post, // the inverse association, if one exists
//      }
//    }
//
//    Comment.belongsTo("post");
//
//    Comment.reflections =>
//    {
//      post: {
//        macro:                  "belongsTo"                // the name of the relationship
//        klass:                  Post,                      // the class of the association
//        foreignKey:             "post_id",                 // default, can be overridden
//        #associationPrimaryKey: "id",                      // the primary key of the Post class
//        #inverse:               Post.reflections.comments, // the inverse association, if one exists
//      }
//    }
angular
  .module('ngActiveResource')
  .factory('ARReflections', ['ARMixin', 'ARFunctional.Collection',
  'ARReflections.HasManyReflection', 'ARReflections.BelongsToReflection', 
  'ARReflections.AbstractReflection',
  function(mixin, FunctionalCollection, HasManyReflection, BelongsToReflection, AbstractReflection) {

    Reflections.HasManyReflection   = HasManyReflection;
    Reflections.BelongsToReflection = BelongsToReflection;
    Reflections.AbstractReflection  = AbstractReflection;

    Reflections.included = function(klass) {
      privateVariable(klass, "reflections", new Reflections(klass));

      klass.hasMany   = reflectionMacro("hasMany");
      klass.belongsTo = reflectionMacro("belongsTo");

      klass.reflectOnAssociation = function(association) {
        return klass.reflections[association];
      }

      function reflectionMacro(macro) {
        return function(associationName, options) {
          options = options || {};
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

        klass.reflections[name] = new MacroClass(name, _.merge({macro: macro,
                                                                inverseOf: klass}, options));
      });

      mixin(this, FunctionalCollection);
    }

    return Reflections;
  }]);
