angular
  .module('ngActiveResource')
  .factory('ARAssociatable.Association', ['$injector', function($injector) {
    function Association() {
      this.__getClass = function() {
        return this.options.provider ? $injector.get(this.options.provider) :
                                       $injector.get(guessClassName.call(this));
      }

      function guessClassName() {
        return this.associationName.classify();
      }
    }

    return Association;
  }]);
