angular
  .module('Mocks', ['ngActiveResource'])
  .factory('Mocks', ['Post', 'Comment', 'Person', 'TShirt', 'ARHat', 'ARCollection', 'Author',
  function(Post, Comment, Person, TShirt, Hat, Collection, Author) {
    return {
      Post: Post,
      Author: Author,
      Comment: Comment,
      Person: Person,
      Hat: Hat,
      Collection: Collection,
      TShirt: TShirt
    };
  }]);
