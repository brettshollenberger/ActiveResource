angular
  .module('ngActiveResource')
  .factory('ARAssociatable.Association', ['$injector', function($injector) {
    function Association() {

      this.__getClass = function() {
        return this.options.provider ? get(this.options.provider) : 
                                       get(guessClassName.call(this));
      }

      function get(providerName) {
        if (!!cached(providerName)) { return cached(providerName); }

        cache(providerName);
        return get(providerName);
      }

      function cached(providerName) {
        return Association.associations[providerName];
      }

      function cache(providerName) {
        Association.associations[providerName] = $injector.get(providerName);
      }

      function guessClassName() {
        return this.associationName.classify();
      }
    }

    Association.associations = {};

    return Association;
  }]);
