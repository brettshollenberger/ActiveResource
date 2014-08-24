angular
  .module('Mocks')
  .factory('Member', ['ngActiveResource', function(ngActiveResource) {

    Member.inherits(ngActiveResource.Base);

    Member.belongsTo("district");
    Member.belongsTo("school");

    Member.api.configure(function(config) {
      config.resource = "users";
    });

    Member.parse = function(json) {
      if (json.school) {
        json.school_id   = json.school.id;
        delete json.school;
      }

      if (json.district) {
        json.district_id = json.district.id;
        delete json.district;
      }

      return json;
    }

    function Member(attributes) {
      this.string("name");
    }

    return Member;
  }]);
