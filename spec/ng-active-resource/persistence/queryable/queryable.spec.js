describe("ARQueryable", function() {
  beforeEach(function() {
    backend.whenGET("https://api.edmodo.com/posts.json?author_id=1")
      .respond([{id: 1, title: "My Great Post", author_id: 1},
                {id: 2, title: "Joan of Shark", author_id: 1}], {}, 200);
  });

  it("finds multiple instances via query", function() {
    var posts = Post.where({author_id: 1});
    backend.flush();

    expect(posts.first().id).toEqual(1);
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
