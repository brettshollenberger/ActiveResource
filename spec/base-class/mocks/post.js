angular
  .module('Mocks')
  .factory('Post', ['BaseClass', function(BaseClass) {

    function Post(attributes) {
      this.integer("id");
      this.string("title");
      this.number("commentCount");
      this.boolean("public");
    };

    Post.inherits(BaseClass.Base);
    return Post;
  }]);
