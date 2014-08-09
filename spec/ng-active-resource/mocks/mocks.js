angular
  .module('Mocks', ['ngActiveResource'])
  .factory('Mocks', ['Player', 'Ship', 'Post', 'Comment', 'Person', 'TShirt', 'ARHat', 'ARCollection', 'Author',
  function(Player, Ship, Post, Comment, Person, TShirt, Hat, Collection, Author) {
    return {
      Player: Player,
      Ship: Ship,
      Post: Post,
      Author: Author,
      Comment: Comment,
      Person: Person,
      Hat: Hat,
      Collection: Collection,
      TShirt: TShirt
    };
  }]);
