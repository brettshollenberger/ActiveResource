angular
  .module('ngActiveResource')
  .factory('ARWatchable', ['ARMixin', 'ARFunctional.Collection', 
  function(mixin, FunctionalCollection) {

    Watchable.extended = function(klass) {
      klass.watchedCollections = mixin([], FunctionalCollection);

      klass.watchedCollections.$remove = function(instance) {
        this.each(function(watchedCollection) {
          watchedCollection.$reject(function(watchedInstance) {
            return watchedInstance == instance;
          });
        });
      }
    }

    function Watchable() {}

    return Watchable;

  }]);
