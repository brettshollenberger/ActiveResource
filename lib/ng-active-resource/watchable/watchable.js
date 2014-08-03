angular
  .module('ngActiveResource')
  .factory('ARWatchable', ['ARMixin', 'ARFunctional.Collection', 
  function(mixin, FunctionalCollection) {

    Watchable.extended = function(klass) {
      klass.after("delete", klass.watchedCollections.$remove);
    }

    function Watchable() {
      this.watchedCollections = Watchable.watchedCollections;
    }

    Watchable.watchedCollections = mixin([], FunctionalCollection);

    Watchable.watchedCollections.$remove = function(instance) {
      Watchable.watchedCollections.each(function(watchedCollection) {
        watchedCollection.$reject(function(watchedInstance) {
          return watchedInstance === instance;
        });
      });
    }

    return Watchable;

  }]);
