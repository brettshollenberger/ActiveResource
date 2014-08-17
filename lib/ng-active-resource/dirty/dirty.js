// module ARDirty
//
// ARDirty adds methods for determining whether or not instance contain change attributes since
// they were last saved.
//
// /////////////////////////////////////////////////////////////////////////////////////////////
//
// method dirty
//
// @param options {object} - Options include:
//
//                            -- ignoreAssociations: Whether or not to consider foreign keys and
//                            associated instances when deciding whether or not an instance has changed.
//
//                            By default, ignoreAssociations is false.
//
// @returns boolean - Instance has been changed since last save
//
// Examples:
//
// 1)
//   comment = Comment.new();
//   comment.dirty();
//   >> false
//
//   comment.update({body: "Great post!"});
//   comment.dirty();
//   >> true
//
//   comment.save();
//   comment.dirty();
//   >> false
//
// 2)
//   post    = Post.find(1);
//   comment = post.comments.new();
//   comment.dirty();
//   >> false
//
//   comment.dirty({ignoreAssociations: false});
//   >> true // post_id has changed to 1 and the comment has not been saved
//
// /////////////////////////////////////////////////////////////////////////////////////////////
//
// method changedAttributes
//
// @param options {object} - Options include:
//
//                            -- ignoreAssociations: Whether or not to consider foreign keys and
//                            associated instances when deciding whether or not an instance has changed.
//
//                            By default, ignoreAssociations is false.
//
// @returns array - Attributes that have changed since last save
//
// Examples:
//
// 1)
//   comment = Comment.new();
//   comment.changedAttributes();
//   >> []
//
//   comment.update({body: "Great post!"});
//   comment.changedAttributes();
//   >> ["body"]
//
//   comment.save();
//   comment.changedAttributes();
//   >> []
//
// 2)
//   post    = Post.find(1);
//   comment = post.comments.new();
//   comment.changedAttributes();
//   >> []
//
//   comment.changedAttributes({ignoreAssociations: false});
//   >> ["post_id"]
//

angular
  .module('ngActiveResource')
  .factory('ARDirty', ['ARMixin', 'ARSerializeAssociations', function(mixin, serializeAssociations) {

    Dirty.extended = function(klass) {
      klass.after("new", function(instance) {
        mixin(instance, Dirty);
        instance.buildDirtyAttributes();
        delete instance.buildDirtyAttributes;
      });

      klass.after("save", function(instance) {
        privateVariable(instance, 'lastSave', _.cloneDeep(instance));
      });
    }

    function Dirty() {
      privateVariable(this, 'dirty', function(options) {
        options = new DirtyOptions(options);
        return this.changedAttributes(options).length > 0;
      });

      privateVariable(this, 'changedAttributes', function(options) {
        var options           = new DirtyOptions(options),
            lastSave          = this.lastSave || {},
            currentAttributes = _.cloneDeep(this),
            klass             = this.constructor,
            reflections       = klass.reflections || {};

        lastSave          = serializeAssociations(lastSave, klass.reflections);
        currentAttributes = serializeAssociations(currentAttributes, klass.reflections);

        if (options.ignoreAssociations) {
          lastSave          = dropAssociations(lastSave, reflections);
          currentAttributes = dropAssociations(currentAttributes, reflections);
        }

        return _.chain(currentAttributes)
                .keys()
                .map(function(attributeName) {
                  if (attributeChanged(attributeName, currentAttributes, lastSave)) { 
                    return attributeName; 
                  }
                }, this)
                .compact()
                .value();
      });

      privateVariable(this, 'buildDirtyAttributes', function() {
        _.each(_.keys(this), function(propertyName) {
          privateVariable(this, propertyName + "Changed", function() {
            return attributeChanged(propertyName, 
                    serializeAssociations(_.cloneDeep(this), this.constructor.reflections),
                      this.lastSave);
          });

          privateVariable(this, propertyName + "Was", function() {
            return this.lastSave[propertyName];
          });
        }, this);
      });
    }

    function DirtyOptions(options) {
      options = options || {};
      return _.defaults(options, {ignoreAssociations: true});
    }

    function dropAssociations(object, reflections) {
      if (!_.isFunction(reflections.each)) { return object; }

      reflections.each(function(reflection) {
        delete object[reflection.name];
        delete object[reflection.foreignKey];
      });

      return object;
    }

    function attributeChanged(attributeName, currentAttributes, lastSave) {
      if (_.isUndefined(currentAttributes[attributeName])) { return false; }
      if (_.isUndefined(lastSave[attributeName])) { lastSave[attributeName] = ""; }

      if (_.isObject(currentAttributes[attributeName])) {
        return objectsDifferent(currentAttributes[attributeName], lastSave[attributeName]);
      }

      return String(currentAttributes[attributeName]) !== String(lastSave[attributeName]);
    }

    function objectsDifferent(obj1, obj2) {
      return obj2string(obj1) !== obj2string(obj2);
    }

    function obj2string(obj) {
      var keys     = _.keys(obj).sort();
      return JSON.stringify(
        _.inject(keys, function(str, key) { str[key] = obj[key]; return str; }, {})
      );
    }

    return Dirty;

  }]);
