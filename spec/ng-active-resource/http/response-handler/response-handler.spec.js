describe("ARQueryable", function() {
  beforeEach(function() {
    backend.whenGET("https://api.edmodo.com/posts.json?author_id=1")
      .respond(200, [{id: 1, title: "My Great Post", author_id: 1},
                {id: 2, title: "Joan of Shark", author_id: 1}], {});

    backend.whenGET("https://api.edmodo.com/posts.json?author_id=2")
      .respond(500, {error: "Internal server error"}, {});

    backend.whenGET("https://api.edmodo.com/comments.json?post_id=1")
      .respond(200, {error: "Internal server error"}, {});
  });

  it("resolves successful requests", function() {
    var posts = Post.where({author_id: 1});
    backend.flush();

    expect(posts.first().id).toEqual(1);
  });

  it("rejects errors", function() {
    var posts = Post.where({author_id: 2});
    backend.flush();

    expect(posts.response.error).toEqual("Internal server error");
  });

  it("adds custom handlers", function() {
    Comment.whereHandler = function(response, status, headers) {
      return _.isUndefined(response.data.error);
    }

    var comments = Comment.where({post_id: 1});
    backend.flush();

    expect(comments.response.error).toEqual("Internal server error");
  });
});
