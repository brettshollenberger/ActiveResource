angular
  .module('Mocks', ['BaseClass'])
  .factory('Mocks', ['Post', 'Person', function(Post, Person) {
    return {
      Post: Post,
      Person: Person
    };
  }]);
