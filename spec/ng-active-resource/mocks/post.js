angular
  .module('Mocks')
  .factory('Post', ['ngActiveResource', function(ngActiveResource) {

    Post.inherits(ngActiveResource.Base);

    function Post(attributes) {
      this.integer("id");
      this.string("title");
      this.integer("author_id");
      this.number("commentCount");
      this.boolean("public");
    };

    Post.api().configure(function(config) {
      config.baseURL      = "https://api.edmodo.com";
      config.format       = "json";
      config.appendFormat = true;
    });

    Post.parse = function(post) {
      if (post.author) {
        post.author_id = post.author.id;
        delete post.author;
      }

      return post;
    }

    return Post;
  }]);
