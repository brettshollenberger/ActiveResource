describe("BCDefinable", function() {
  var post;
  beforeEach(function() {
    post = Post.new({id: 1, title: "What I Want", commentCount: 5, public: true});
  });

  it("adds integer attributes", function() {
    expect(post.id).toEqual(1);
  });

  it("adds string attributes", function() {
    expect(post.title).toEqual("What I Want");
  });

  it("adds number properties", function() {
    expect(post.commentCount).toEqual(5);
  });

  it("adds boolean properties", function() {
    expect(post.public).toEqual(true);
  });
});

