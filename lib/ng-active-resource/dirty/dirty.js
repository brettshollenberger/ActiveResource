angular
  .module('ngActiveResource')
  .factory('ARDirty', ['ARMixin', function(mixin) {

    Dirty.extended = function(klass) {
      klass.after("new", function(instance) {
        mixin(instance, Dirty);
      });

      klass.after("save", function(instance) {
        privateVariable(instance, 'lastSave', _.cloneDeep(instance));
      });
    }

    function Dirty() {
      privateVariable(this, 'dirty', function() {
        return this.changedAttributes().length > 0;
      });

      privateVariable(this, 'changedAttributes', function() {
        var lastSave          = this.lastSave || {},
            currentAttributes = _.cloneDeep(this);

        lastSave          = this.constructor.deserialize(this.constructor.serialize(lastSave));
        currentAttributes = this.constructor.deserialize(this.constructor.serialize(currentAttributes));
        return _.compact(_.map(Object.keys(currentAttributes), function(attributeName) {
          if (attributeChanged(attributeName, currentAttributes, lastSave)) { 
            return attributeName; 
          }
        }, this));
      });
    }

    function attributeChanged(attributeName, currentAttributes, lastSave) {
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
