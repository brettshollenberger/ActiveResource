var comment, comment2, post;

ddescribe("ARAssociatable", function() {
  describe("HasMany", function() {
    it("initializes hasMany associations", function() {
      comment = Comment.new({id: 1});
      post    = Post.new({id: 1, comments: comment});

      expect(post.comments).toContain(comment);
    });

    it("updates hasMany associations", function() {
      comment  = Comment.new({id: 1});
      comment2 = Comment.new({id: 2});
      post     = Post.new({id: 1, comments: comment});
      post.update({comments: comment2});

      expect(post.comments).not.toContain(comment);
      expect(post.comments).toContain(comment2);
    });

    it("has methods to add associated instances", function() {
      post    = Post.new({id: 1});
      comment = post.comments.new({id: 2});

      expect(post.comments).toContain(comment);
    });
  });
});
