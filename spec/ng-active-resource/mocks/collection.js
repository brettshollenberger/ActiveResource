angular
  .module('Mocks')
  .factory('ARCollection', ['ngActiveResource', function(ngActiveResource) {

    Collection.inherits(ngActiveResource.Base);

    function Collection(attributes) {
    };

    return Collection;
  }]);
