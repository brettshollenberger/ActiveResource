angular
  .module('Mocks', ['ActiveResource'])
  .factory('Mocks', ['Post', function(Post) {
    return {
      Post: Post
    };
  }]);
