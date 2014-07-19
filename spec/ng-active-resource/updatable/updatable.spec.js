describe("ARUpdatable", function() {
  it("updates on the client side", function() {
    var post = Post.new();
    post.update({id: 1, title: "My Great Post"});

    expect(post.id).toEqual(1);
    expect(post.title).toEqual("My Great Post");
  });

  it("sets associations with foreign keys", function() {
    var post    = Post.new({id: 1});
    var comment = Comment.new();

    comment.update({post_id: 1});

    expect(comment.post).toEqual(post);
  });
});
