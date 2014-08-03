angular
  .module('Mocks')
  .factory('Author', ['ngActiveResource', function(ngActiveResource) {

    Author.inherits(ngActiveResource.Base);

    function Author(attributes) {
      this.string("name");
    }

    Author.hasMany("posts");

    return Author;
  }]);
