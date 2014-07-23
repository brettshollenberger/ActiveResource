angular
  .module('Mocks')
  .factory('ARCollection', ['ngActiveResource', function(ngActiveResource) {

    ARCollection.inherits(ngActiveResource.Base);

    function ARCollection(attributes) {
    };

    ARCollection.hasMany("hats", {provider: "ARHat"});

    return ARCollection;
  }]);
