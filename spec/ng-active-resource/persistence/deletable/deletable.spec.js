describe("ARDeletable", function() {
  describe("Deleting instances", function() {
    var posts, posts2, post;
    beforeEach(function() {
      backend.whenGET("https://api.edmodo.com/posts.json?author_id=1").respond(200, [
        {id: 1, title: "My Great Post", author_id: 1},
        {id: 2, title: "My Greater Post", author_id: 1}
      ]);

      backend.whenDELETE("https://api.edmodo.com/posts/1.json").respond(200, {});

      spyOn($http, "delete").andCallThrough();

      posts  = Post.where({author_id: 1});
      posts2 = Post.where({author_id: 1});
      backend.flush();

      post  = posts.first();
      post.$delete();

      backend.flush();
    });

    it("calls the deleteURL", function() {
      expect($http.delete.mostRecentCall.args[0]).toEqual("https://api.edmodo.com/posts/1.json");
    });

    it("removes all properties from the deleted object", function() {
      expect(post.id).toBeUndefined();
      expect(post.title).toBeUndefined();
    });

    it("removes instances from all watched collections", function() {
      expect(Post.watchedCollections.first()).not.toContain(post);
      expect(Post.watchedCollections.last()).not.toContain(post);
    });
  });

  describe("Deleting associated instances", function() {

    var post, comment;
    beforeEach(function() {
      backend.whenDELETE("https://api.edmodo.com/comments/1.json").respond(200, {});

      post    = Post.new({id: 1});
      comment = post.comments.new({id: 1});

      comment.$delete();

      backend.flush();
    });

    it("removes the instance from all associations", function() {
      expect(post.comments).not.toContain(comment);
    });
  });
});
