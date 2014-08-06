ddescribe("ARRefinable", function() {
  beforeEach(function() {
    backend.whenGET("https://api.edmodo.com/posts.json?author_id=1")
      .respond(200, [{id: 1, title: "My Great Post", author_id: 1},
                {id: 2, title: "Joan of Shark", author_id: 1}], {});

    backend.whenGET("https://api.edmodo.com/posts.json")
      .respond(200, [{id: 1, title: "My Great Post", author_id: 1},
                {id: 2, title: "Joan of Shark", author_id: 1}], {});
  });

  it("creates an empty query set", function() {
    var posts = new ngActiveResource.Refinable(Post);
    expect(posts.queries).toEqual({});
  });

  it("has a reference to the class it was derived from", function() {
    var posts = new ngActiveResource.Refinable(Post);
    expect(posts.klass).toEqual(Post);
  });

  iit("adds initial instances via #where method", function() {
    var posts = new ngActiveResource.Refinable(Post);
    posts.where({author_id: 1});
    backend.flush();

    expect(posts.first().id).toEqual(1);
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
