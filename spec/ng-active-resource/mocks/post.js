angular
  .module('Mocks')
  .factory('Post', ['ngActiveResource', function(ngActiveResource) {

    Post.inherits(ngActiveResource.Base);

    function Post(attributes) {
      // this.integer("id");
      this.string("title");
      this.integer("author_id");
      this.number("commentCount");
      this.boolean("public");
    };

    Post.hasMany("comments");

    Post.api.configure(function(config) {
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

    Post.format = function(post) {
      if (post.author_id) {
        post.author = {id: post.author_id}
        delete post.author_id;
      }

      return post;
    }

    return Post;
  }]);
