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

    Post.api().configure(function(api) {
      api.baseURL      = "https://api.edmodo.com";
      api.format       = "json";
      api.appendFormat = true;
    });

    return Post;
  }]);
