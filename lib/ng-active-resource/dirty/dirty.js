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
          if (this[attributeName] !== lastSave[attributeName]) { return attributeName; }
        }, this));
      });
    }

    return Dirty;

  }]);
