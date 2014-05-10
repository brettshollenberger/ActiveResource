angular
  .module('Mocks')
  .factory('Post', ['BaseClass', function(BaseClass) {
    function Post(attributes) {
      this.id = attributes.id;
    };
    Post.inherits(BaseClass.Base);
    return Post;
  }]);
