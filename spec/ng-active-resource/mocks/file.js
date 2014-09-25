angular
  .module('Mocks')
  .factory('File', ['ngActiveResource', function(ngActiveResource) {

    File.inherits(ngActiveResource.Base);

    File.hasMany("files");

    File.belongsTo("parent", {
      provider: "File",
      foreignKey: "parent_id"
    });

    function File(attributes) {
      this.string("name");
    }

    return File;
  }]);
