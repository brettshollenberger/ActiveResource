angular
  .module('ngActiveResource')
  .factory('ARStrictRequire', [function() {
    function strictRequire(initializationObject, requiredAttributes) {
      _.each(requiredAttributes, function(requiredAttribute) {
        if (initializationObject[requiredAttribute] === undefined) {
          throw new StrictRequireError(requiredAttribute);
        };
      });
    };

    function StrictRequireError(attribute) {
      this.name    = "StrictRequireError";
      this.message = attribute + " must be defined.";
    };
    StrictRequireError.prototype = Error.prototype;

    return strictRequire;
  }]);
