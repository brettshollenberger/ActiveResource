angular
  .module('Mocks', ['ngActiveResource'])
  .factory('Mocks', ['Player', 'Ship', 'Post', 'Comment', 'Person', 'TShirt', 'ARHat', 'ARCollection', 'Author', 'Member', 'District', 'School',
  function(Player, Ship, Post, Comment, Person, TShirt, Hat, Collection, Author, 
  Member, District, School) {
    return {
      Player: Player,
      Ship: Ship,
      Post: Post,
      Author: Author,
      Comment: Comment,
      Person: Person,
      Hat: Hat,
      Collection: Collection,
      TShirt: TShirt,
      Member: Member,
      District: District,
      School: School
    };
  }]);
