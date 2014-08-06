ddescribe("ARRefinable", function() {
  beforeEach(function() {
    backend.whenGET("https://api.edmodo.com/posts.json?author_id=1")
      .respond(200, [{id: 1, title: "My Great Post", author_id: 1},
                {id: 2, title: "Joan of Shark", author_id: 1}], {});

    backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=2")
      .respond(200, [{id: 3, title: "A very new post", author_id: 1},
                {id: 4, title: "My favorite thangs", author_id: 1}], {});
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

  it("stashes queries", function() {
    var posts = new ngActiveResource.Refinable(Post);
    posts.where({author_id: 1});
    backend.flush();

    expect(posts.queries.find({author_id: 1}).first()).toEqual(posts.first());
    expect(posts.queries.find({author_id: 1}).last()).toEqual(posts.last());
  });

  iit("stashes the most recent call", function() {
    var posts = new ngActiveResource.Refinable(Post);
    posts.where({author_id: 1});
    backend.flush();

    expect(posts.mostRecentCall).toEqual({author_id: 1});
  });

  it("refines queries", function() {
    var posts = new ngActiveResource.Refinable(Post);
    posts.where({author_id: 1});
    backend.flush();
    posts.where({page: 2});
    backend.flush();

    expect(posts.first().id).toEqual(3);
    expect(posts.last().id).toEqual(4);
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
});
