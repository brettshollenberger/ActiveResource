xdescribe("ARPaginatable", function() {
    var posts;
    beforeEach(function() {
      backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=1&per_page=5")
      .respond(200, [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}],
        {'Link': 
          '<https://api.edmodo.com/posts.json?author_id=1&page=2&per_page=5>; rel="next"'});

          backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=2&per_page=5")
      .respond(200, [{id: 6}, {id: 7}, {id: 8}, {id: 9}, {id: 10}],
        {'Link': 
          '<https://api.edmodo.com/posts.json?author_id=1&page=1&per_page=5>; rel="previous", <https://api.edmodo.com/posts.json?author_id=1&page=3&per_page=5; rel="next"'});

          backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=3&per_page=5")
      .respond(200, [{id: 11}, {id: 12}, {id: 13}, {id: 14}, {id: 15}],
        {'Link': 
          '<https://api.edmodo.com/posts.json?author_id=1&page=2&per_page=5>; rel="previous", <https://api.edmodo.com/posts.json?author_id=1&page=4&per_page=5; rel="next"'});

          backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=4&per_page=5")
      .respond(200, [{id: 16}, {id: 17}, {id: 18}, {id: 19}, {id: 20}],
        {'Link': 
          '<https://api.edmodo.com/posts.json?author_id=1&page=3&per_page=5>; rel="previous", <https://api.edmodo.com/posts.json?author_id=1&page=5&per_page=5; rel="next"'});

        backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=5&per_page=5")
          .respond(200, [{id: 21}, {id: 22}, {id: 23}, {id: 24}, {id: 25}],
              {'Link': 
                '<https://api.edmodo.com/posts.json?author_id=1&page=4&per_page=5>; rel="previous"'});

        backend.whenGET("https://api.edmodo.com/posts.json?author_id=2&page=1&per_page=1")
          .respond(200, [{id: 200}],
              {'Link': 
                '<https://api.edmodo.com/posts.json?author_id=2&page=2&per_page=1>; rel="next"'});

        backend.whenGET("https://api.edmodo.com/posts.json?author_id=2&page=2&per_page=1")
          .respond(200, [{id: 201}],
              {'Link': 
                '<https://api.edmodo.com/posts.json?author_id=2&page=3&per_page=1>; rel="next", <https://api.edmodo.com/posts.json?author_id=2&page=1&per_page=1; rel="previous"'});

        backend.whenGET("https://api.edmodo.com/posts.json?author_id=2&page=3&per_page=1")
          .respond(200, [{id: 202}]);
  });

  describe("Starting at the beginning of a list", function() {
    beforeEach(function() {
      posts = Post.where({author_id: 1, page: 1, per_page: 5});

      spyOn($http, "get").andCallThrough();
      backend.flush();

      posts.paginate();
    });

    it("starts off on the requested page", function() {
      expect(posts.first().id).toEqual(1);
      expect(posts.last().id).toEqual(5);
    });
  });
});
