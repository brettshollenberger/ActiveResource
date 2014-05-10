angular
  .module('Mocks')
  .factory('Post', ['ActiveResource', function(ActiveResource) {
    function Post(attributes) {
      this.id    = attributes.id;
      this.title = attributes.title;

      this.validates({
        title: { required: true }
      });
    };

    Post.inherits(ActiveResource.Base);
    Post.api.set('http://api.faculty.com');
    return Post;
  }]);
