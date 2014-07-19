angular
  .module('ngActiveResource')
  .factory('ARFunctional', [function() {
    function Functional() {
      this.__tap = function(fn) {
        fn(this);
        return this;
      }
    }

    return Functional;
  }]);
