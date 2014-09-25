describe("ARQueryable", function() {
  beforeEach(function() {
    backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=1")
      .respond(200, [{id: 1, title: "My Great Post", author_id: 1},
                {id: 2, title: "Joan of Shark", author_id: 1}], {});

    backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=1&per_page=5")
      .respond(200, [{id: 1, title: "My Great Post", author_id: 1},
                {id: 2, title: "Joan of Shark", author_id: 1}], {});

    backend.whenGET("https://api.edmodo.com/posts.json?page=1")
      .respond(200, [{id: 1, title: "My Great Post", author_id: 1},
                {id: 2, title: "Joan of Shark", author_id: 1}], {});

    backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=2&per_page=5")
      .respond(200, [{id: 6}, {id: 7}, {id: 8}, {id: 9}, {id: 10}],
        {'Link': 
         '<https://api.edmodo.com/posts.json?author_id=1&page=1&per_page=5>; rel="previous", <https://api.edmodo.com/posts.json?author_id=1&page=3&per_page=5; rel="next"'});

    backend.whenGET("https://api.edmodo.com/posts.json?api_token=my_api_token&author_id=1&page=1")
           .respond(200, [{id: 1, author_id: 1}]);

    backend.whenGET("https://api.edmodo.com/users.json?district_id=1&page=1")
           .respond(200, [{id: 1, district_id: 1}]);

    backend.whenGET("https://api.edmodo.com/users.json?page=1&school_id=1")
           .respond(200, [{id: 1, school_id: 1}]);

    backend.whenGET("https://api.edmodo.com/users.json?page=1&query=thing&school_id=1")
           .respond(200, [{id: 1, school_id: 1}]);

    spyOn($http, "get").andCallThrough();

    backend.flush();
  });

  it("finds multiple instances via query", function() {
    var posts = Post.where({author_id: 1});
    backend.flush();

    expect(posts.first().id).toEqual(1);
  });

  it("watches collections queried for", function() {
    var posts = Post.where({author_id: 1});
    backend.flush();

    expect(Post.watchedCollections).toContain(posts);
  });

  it("uses findAll as an alias for where with no options", function() {
    var posts = Post.findAll();
    backend.flush();

    expect(posts.length).toEqual(2);
  });

  it("transforms the json into model instances", function() {
    var posts = Post.where({author_id: 1});
    backend.flush();

    expect(posts.first().constructor).toEqual(Post);
  });

  it("grabs associations", function() {
    var author = Author.new({id: 1, name: "Jane Austen"});
    var posts  = Post.where({author_id: 1});

    backend.flush();

    posts.each(function(post) {
      expect(post.author).toEqual(author);
    });
  });

  it("caches query objects", function() {
    var posts = Post.where({author_id: 1, page: 2, per_page: 5});
    backend.flush();

    expect(posts.queries.find({author_id: 1, page: 2, per_page: 5}).objects.pluck("id"))
      .toEqual(posts.pluck("id"));
  });

  it("caches query responses", function() {
    var posts = Post.where({author_id: 1, page: 2, per_page: 5});
    backend.flush();

    expect(posts.queries.find({author_id: 1, page: 2, per_page: 5}).headers.link.next.params)
      .toEqual({
        author_id: 1,
        page: 3,
        per_page: 5
      });
  });

  it("does not query with empty params", function() {
    var posts = Post.where({author_id: 1, query: ""});
    backend.flush();

    expect($http.get.mostRecentCall.args[1].params).toEqual({author_id: 1, page: 1});

    var posts = Post.where({author_id: 1, query: ""});
    backend.flush();
  });

  describe("#appendQueryString", function() {
    it("appends params to the query string without changing location", function() {
      var posts = Post.where({author_id: 1});
      backend.flush();

      posts.where({page: 2, per_page: 5}, {appendQueryString: true});
      backend.flush();

      expect($location.search()).toEqual({page: '2', per_page: '5', author_id: '1'});

      posts.where({page: 1}, {appendQueryString: true});
      backend.flush();

      expect($location.search()).toEqual({page: '1', per_page: '5', author_id: '1'});
    });

    it("blacklists params, and will not append them to the query string", function() {
      Post.stateParams.blacklist = ["api_token"];

      var posts = Post.where({author_id: 1, api_token: "my_api_token"}, {appendQueryString: true});
      backend.flush();

      expect($location.search()).toEqual({author_id: '1', page: '1'});
    });

    it("whitelists params, and will only append them to the query string", function() { 
      Post.stateParams.whitelist = ["author_id", "page"];

      var posts = Post.where({author_id: 1, api_token: "my_api_token"}, {appendQueryString: true});
      backend.flush();

      expect($location.search()).toEqual({author_id: '1', page: '1'});
    });

    it("wraps $location service with helper to choose routeProvider", function() {
      var members = Member.where({district_id: 1}, {appendQueryString: true});
      backend.flush();

      expect($location.$$url).toEqual("/districts/1/members/?page=1");
      expect($location.search()).toEqual({page: "1"});
      expect($routeParams).toEqual({page: "1", district_id: '1'});

      var members = Member.where({school_id: 1}, {appendQueryString: true});
      backend.flush();

      expect($location.$$url).toEqual("/schools/1/members/?page=1");
      expect($location.search()).toEqual({page: "1"});
      expect($routeParams).toEqual({page: "1", school_id: '1'});

      members.where({query: "thing"}, {appendQueryString: true});
      backend.flush();

      expect($location.$$url).toEqual("/schools/1/members/?query=thing&page=1");
      expect($location.search()).toEqual({query: "thing", page: "1"});
      expect($routeParams).toEqual({page: "1", query: "thing", school_id: "1"});
    });
  });
});
