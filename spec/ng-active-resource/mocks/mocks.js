angular
  .module('Mocks', ['ngActiveResource'])
  .factory('Mocks', ['Post', 'Comment', 'Person', 'TShirt', 'ARHat', 'ARCollection',
  function(Post, Comment, Person, TShirt, Hat, Collection) {
    return {
      Post: Post,
      Comment: Comment,
      Person: Person,
      Hat: Hat,
      Collection: Collection,
      TShirt: TShirt
    };
  }]);
