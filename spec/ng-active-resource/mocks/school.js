angular
  .module('Mocks')
  .factory('School', ['ngActiveResource', function(ngActiveResource) {

    School.inherits(ngActiveResource.Base);

    School.hasMany("members");
    School.belongsTo("district");

    function School(attributes) {
      this.string("name");
    }

    return School;
  }]);
