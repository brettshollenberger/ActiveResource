angular
  .module('Mocks')
  .factory('District', ['ngActiveResource', function(ngActiveResource) {

    District.inherits(ngActiveResource.Base);

    District.hasMany("schools");
    District.hasMany("members");

    function District(attributes) {
      this.string("name");
    }

    return District;
  }]);
