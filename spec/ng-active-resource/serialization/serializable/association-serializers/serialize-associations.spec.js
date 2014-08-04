describe("AssociationSerializer", function() {
  var post, comment1, comment2, serializedComment, serializedPost;
  beforeEach(function() {
    post              = Post.new({id: 1, title: "Great post!"});
    comment1          = post.comments.new({id: 1, body: "Great comment!"});
    comment2          = post.comments.new({id: 2, body: "Good comment :("});
    serializedComment = serializeAssociations(comment1);
    serializedPost    = serializeAssociations(post);
  });

  it("derives foreign keys (foreignkeyify) and drops collection associations (dropHasMany)", function() {
    expect(serializedComment.post_id).toEqual(1);
    expect(serializedPost.comments).toBeUndefined();
  });
});
