angular
  .module('Mocks', ['ngActiveResource'])
  .factory('Mocks', ['Post', 'Comment', 'Person', 'TShirt', 'ARHat', 
  function(Post, Comment, Person, TShirt, Hat) {
    return {
      Post: Post,
      Comment: Comment,
      Person: Person,
      Hat: Hat,
      TShirt: TShirt
    };
  }]);
