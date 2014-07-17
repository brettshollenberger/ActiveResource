angular
  .module('Mocks')
  .factory('Post', ['ngActiveResource', function(ngActiveResource) {

    function Post(attributes) {
      this.integer("id");
      this.string("title");
      this.number("commentCount");
      this.boolean("public");
    };

    Post.inherits(ngActiveResource.Base);
    Post.api().set("https://api.edmodo.com").format("json");
    return Post;
  }]);
