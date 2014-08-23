describe("ARPaginatable", function() {
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

    it("cannot move to the previous page after preloading", function() {
      backend.flush();
      expect(posts.previous_page_exists()).toBe(false);
    });

    it("can move to the next page", function() {
      backend.flush();
      expect(posts.next_page_exists()).toBe(true);
    });

    it("passes on options to where", function() {
      backend.flush();
      posts.next_page({appendQueryString: true});
      backend.flush();

      expect($location.search()).toEqual({page: '2', per_page: '5', author_id: '1'});
    });

    describe("Edge cases", function() {
      it("does not preload pages unless they are directly next or previous", function() { 
        backend.flush();
        posts.next_page();
        backend.flush();

        posts.previous_page();
        $timeout.flush();

        posts.next_page();
        expect(function() { backend.flush(); }).toThrow("No pending request to flush !");

        expect($http.get.mostRecentCall.args[1].params).toEqual({author_id: 1, page: 3, per_page: 5});
      });
    });

    it("does not return to a previously cached page instead of the correct page", function() {
      expect(posts.pluck("id")).toEqual([1, 2, 3, 4, 5]);
      backend.flush();
      posts.next_page();
      expect(posts.pluck("id")).toEqual([6, 7, 8, 9, 10]);
      backend.flush();
      posts.next_page();

      expect(posts.pluck("id")).toEqual([11, 12, 13, 14, 15]);

      posts.previous_page();
      $timeout.flush();

      expect(posts.pluck("id")).toEqual([6, 7, 8, 9, 10]);
    });

    it("does not claim next page doesn't when no more hypermedia is unloaded", function() {
      expect(posts.pluck("id")).toEqual([1, 2, 3, 4, 5]);
      backend.flush();
      posts.next_page();
      expect(posts.pluck("id")).toEqual([6, 7, 8, 9, 10]);
      backend.flush();
      posts.next_page();
      expect(posts.pluck("id")).toEqual([11, 12, 13, 14, 15]);
      backend.flush();
      posts.next_page();
      expect(posts.pluck("id")).toEqual([16, 17, 18, 19, 20]);
      backend.flush();
      posts.next_page();
      expect(posts.pluck("id")).toEqual([21, 22, 23, 24, 25]);
      posts.previous_page();
      expect(posts.pluck("id")).toEqual([16, 17, 18, 19, 20]);

      $timeout.flush();
      expect(posts.next_page_exists()).toEqual(true);
    });
  });

  describe("Starting in the middle of a list", function() {
    beforeEach(function() {
      posts = Post.where({author_id: 1, page: 3, per_page: 5});

      spyOn($http, "get").andCallThrough();
      backend.flush();

      posts.paginate();
    });

    it("starts off on the requested page", function() {
      expect(posts.first().id).toEqual(11);
      expect(posts.last().id).toEqual(15);
    });

    it("moves to the next page", function() {
      backend.flush();
      posts.next_page();

      expect(posts.first().id).toEqual(16);
      expect(posts.last().id).toEqual(20);
    });

    it("moves to the previous page", function() {
      backend.flush();
      posts.previous_page();

      expect(posts.first().id).toEqual(6);
      expect(posts.last().id).toEqual(10);
    });

    it("moves to an exact page", function() {
      backend.flush();
      posts.page(1);
      backend.flush();

      expect(posts.first().id).toEqual(1);
      expect(posts.last().id).toEqual(5);
    });

    it("stores hypermedia", function() {
      expect(posts.paginationHypermedia().next.params).toEqual({
        author_id: 1,
        page: 4,
        per_page: 5
      });

      expect(posts.paginationHypermedia().previous.params).toEqual({
        author_id: 1,
        page: 2,
        per_page: 5
      });
    });

    it("preloads hypermedia when it moves to the next page", function() {
      backend.flush();
      posts.next_page();
      backend.flush();

      expect(posts.first().id).toEqual(16);
      expect(posts.last().id).toEqual(20);

      expect(posts.paginationHypermedia().next.params).toEqual({
        author_id: 1,
        page: 5,
        per_page: 5
      });

      posts.next_page();

      expect(posts.first().id).toEqual(21);
      expect(posts.last().id).toEqual(25);
    });

    it("preloads hypermedia when it moves to the previous page", function() {
      backend.flush();
      posts.previous_page();
      backend.flush();

      expect(posts.first().id).toEqual(6);
      expect(posts.last().id).toEqual(10);

      expect(posts.paginationHypermedia().previous.params).toEqual({
        author_id: 1,
        page: 1,
        per_page: 5
      });

      posts.previous_page();

      expect(posts.first().id).toEqual(1);
      expect(posts.last().id).toEqual(5);
    });

    it("knows when a next page exists", function() {
      expect(posts.current_page()).toEqual(3);
      expect(posts.next_page_exists()).toBe(true);
      backend.flush();
      posts.next_page();
      expect(posts.current_page()).toEqual(4);
      expect(posts.next_page_exists()).toBe(true);
      backend.flush();
      expect(posts.next_page_exists()).toBe(true);
      posts.next_page();
      $timeout.flush();
      expect(posts.current_page()).toEqual(5);
      expect(posts.next_page_exists()).toBe(false);
    });

    it("knows when a previous page exists", function() {
      expect(posts.current_page()).toEqual(3);
      expect(posts.previous_page_exists()).toBe(true);
      backend.flush();
      posts.previous_page();
      backend.flush();
      expect(posts.current_page()).toEqual(2);
      expect(posts.previous_page_exists()).toBe(true);
      posts.previous_page();
      $timeout.flush();
      expect(posts.current_page()).toEqual(1);
      expect(posts.previous_page_exists()).toBe(false);
    });

    it("disposes old pagination when other parameters change", function() {
      posts.where({author_id: 2, per_page: 1});
      backend.flush();

      expect(posts.first().id).toEqual(200);
      expect(posts.last().id).toEqual(200);

      posts.next_page();
      backend.flush();

      expect(posts.first().id).toEqual(201);

      posts.next_page();
      expect(posts.first().id).toEqual(202);

      posts.previous_page();
      expect(posts.first().id).toEqual(201);
    });

    it("appropriately resets x_page_exists data when other parameters change", function() {
      posts.where({author_id: 2, per_page: 1});
      backend.flush();

      expect(posts.next_page_exists()).toBe(true);
    });

    it("resets previously loaded pagination information when pagination params change back and forth", function() {
      posts.where({author_id: 2, per_page: 1});
      backend.flush();
      expect(posts.first().id).toEqual(200);

      posts.next_page();
      backend.flush();
      expect(posts.first().id).toEqual(201);
      expect(posts.paginationHypermedia().previous.params.author_id).toBe(2);

      posts.where({author_id: 1, per_page: 5});
      backend.flush();

      expect(posts.next_page_exists()).toBe(true);
      expect(posts.pluck("id")).toEqual([1, 2, 3, 4, 5]);
      expect(posts.paginationHypermedia().next.params).toEqual({author_id: 1, page: 2, per_page: 5});

      posts.next_page();
      $timeout.flush();
      expect(posts.pluck("id")).toEqual([6, 7, 8, 9, 10]);

      expect(posts.paginationHypermedia().next.params)
        .toEqual({author_id: 1, page: 3, per_page: 5});

      expect(posts.paginationHypermedia().previous.params)
        .toEqual({author_id: 1, page: 1, per_page: 5});

      posts.where({author_id: 2, per_page: 1});

      expect(posts.first().id).toEqual(200);
      expect(posts.paginationHypermedia().next.params).toEqual({
        author_id: 2,
        per_page: 1,
        page: 2
      });
    });
  });
});
