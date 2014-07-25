angular
  .module('Mocks')
  .factory('Comment', ['ngActiveResource', function(ngActiveResource) {

    Comment.inherits(ngActiveResource.Base);

    function Comment(attributes) {
      this.integer("id");
      this.string("body");
    };

    Comment.belongsTo("post");

    return Comment;
  }]);
