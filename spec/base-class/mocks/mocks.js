angular
  .module('Mocks', ['BaseClass'])
  .factory('Mocks', ['Post', 'Person', 'TShirt', function(Post, Person, TShirt) {
    return {
      Post: Post,
      Person: Person,
      TShirt: TShirt
    };
  }]);
