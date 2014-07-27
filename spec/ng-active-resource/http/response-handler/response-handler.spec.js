describe("ARQueryable", function() {
  beforeEach(function() {
    backend.whenGET("https://api.edmodo.com/posts.json?author_id=1")
      .respond(500, {error: "Internal server error"}, {});
  });

  it("rejects errors", function() {
    var posts = Post.where({author_id: 1});
    backend.flush();

    expect(posts.response.error).toEqual("Internal server error");
  });
});
