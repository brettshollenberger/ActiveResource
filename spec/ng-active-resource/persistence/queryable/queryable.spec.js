describe("ARQueryable", function() {
  beforeEach(function() {
    backend.whenGET("https://api.edmodo.com/posts.json?author_id=1")
      .respond(200, [{id: 1, title: "My Great Post", author_id: 1},
                {id: 2, title: "Joan of Shark", author_id: 1}], {});
  });

  it("finds multiple instances via query", function() {
    var posts = Post.where({author_id: 1});
    backend.flush();

    expect(posts.first().id).toEqual(1);
  });

  it("returns queries from the cache if they've already been performed", function() {
    var posts  = Post.where({author_id: 1});
    backend.flush();

    var posts2 = Post.where({author_id: 1});

    expect(posts.first()).toEqual(posts2.first());
  });

  it("stashes duplicate queries to resolve when the original returns", function() {
    var posts  = Post.where({author_id: 1});
    var posts2 = Post.where({author_id: 1});

    backend.flush();

    expect(posts.first()).toEqual(posts2.first());
  });

  it("transforms the json into model instances", function() {
    var posts = Post.where({author_id: 1});
    backend.flush();

    expect(posts.first().constructor).toEqual(Post);
  });

  it("saves the response to the query", function() {
    var posts = Post.where({author_id: 1});
    backend.flush();

    expect(Post.queryCache.find({author_id:1})).toEqual(posts);
  });
});
