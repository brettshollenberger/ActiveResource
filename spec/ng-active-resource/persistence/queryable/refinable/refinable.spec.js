describe("ARRefinable", function() {
  beforeEach(function() {
    backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=1")
      .respond(200, [{id: 1, title: "My Great Post", author_id: 1},
                {id: 2, title: "Joan of Shark", author_id: 1}], {});

    backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=2")
      .respond(200, [{id: 3, title: "A very new post", author_id: 1},
                {id: 4, title: "My favorite thangs", author_id: 1}], {});

    backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=3")
      .respond(200, [{id: 5, title: "The new post", author_id: 1},
                {id: 6, title: "Super gr8", author_id: 1}], {});
  });

  it("creates an empty query set", function() {
    var posts = new ngActiveResource.Refinable(Post);
    expect(posts.queries).toEqual({});
  });

  it("has a reference to the class it was derived from", function() {
    var posts = new ngActiveResource.Refinable(Post);
    expect(posts.klass).toEqual(Post);
  });

  it("adds initial instances via #where method", function() {
    var posts = new ngActiveResource.Refinable(Post);
    posts.where({author_id: 1});
    backend.flush();

    expect(posts.first().id).toEqual(1);
  });

  it("stashes queries and automatically adds pagination if not defined", function() {
    var posts = new ngActiveResource.Refinable(Post);
    posts.where({author_id: 1});
    backend.flush();

    expect(posts.queries.find({author_id: 1, page: 1}).first()).toEqual(posts.first());
    expect(posts.queries.find({author_id: 1, page: 1}).last()).toEqual(posts.last());
  });

  it("stashes the most recent call, automatically adding pagination", function() {
    var posts = new ngActiveResource.Refinable(Post);
    posts.where({author_id: 1});
    backend.flush();

    expect(posts.mostRecentCall).toEqual({author_id: 1, page: 1});
  });

  it("refines queries", function() {
    var posts = new ngActiveResource.Refinable(Post);
    posts.where({author_id: 1});
    backend.flush();
    posts.where({page: 2});
    backend.flush();

    expect(posts.first().id).toEqual(3);
    expect(posts.last().id).toEqual(4);

    expect(posts.queries.find({author_id: 1, page: 2}).first()).toEqual(posts.first());
    expect(posts.queries.find({author_id: 1, page: 2}).last()).toEqual(posts.last());
  });

  it("reverts to cached queries when possible", function() {
    var posts = new ngActiveResource.Refinable(Post);
    posts.where({author_id: 1});
    backend.flush();
    posts.where({page: 2});
    backend.flush();
    posts.where({page: 1});

    expect(posts.first().id).toEqual(1);
    expect(posts.last().id).toEqual(2);
  });

  iit("recognizes queries of different types as fundamentally the same", function() {
    var posts = new ngActiveResource.Refinable(Post);
    posts.where({author_id: 1});
    backend.flush();
    posts.where({page: 2});
    backend.flush();
    posts.where({page: "1"});

    expect(posts.first().id).toEqual(1);
    expect(posts.last().id).toEqual(2);
  });

  it("preloads queries", function() {
    var posts = new ngActiveResource.Refinable(Post);
    posts.where({author_id: 1});
    backend.flush();
    posts.where({page: 3}, {preload: true});
    backend.flush();

    expect(posts.first().id).toEqual(1);
    expect(posts.last().id).toEqual(2);

    posts.where({page: 3});

    expect(posts.first().id).toEqual(5);
    expect(posts.last().id).toEqual(6);
  });
});
