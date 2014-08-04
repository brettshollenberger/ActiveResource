describe("DropHasMany", function() {
  var post, comment1, comment2;
  beforeEach(function() {
    post     = Post.new({id: 1, title: "Great post!"});
    comment1 = post.comments.new({id: 1, body: "Great comment!"});
    comment2 = post.comments.new({id: 2, body: "Good comment :("});
  });

  it("returns a clone with collection associations removed", function() {
    expect(dropHasMany(post).comments).toBeUndefined();
  });
});
