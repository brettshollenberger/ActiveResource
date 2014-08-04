describe("ARQueryable", function() {
  beforeEach(function() {
    backend.whenGET("https://api.edmodo.com/posts.json?author_id=1")
      .respond(200, [{id: 1, title: "My Great Post", author_id: 1},
                {id: 2, title: "Joan of Shark", author_id: 1}], {});

    backend.whenGET("https://api.edmodo.com/posts.json")
      .respond(200, [{id: 1, title: "My Great Post", author_id: 1},
                {id: 2, title: "Joan of Shark", author_id: 1}], {});
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
});
