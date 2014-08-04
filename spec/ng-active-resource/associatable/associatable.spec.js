var comment, comment2, post;

describe("ARAssociatable", function() {
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

    describe("#new", function() {
      it("creates associated instances via `new` method", function() {
        post    = Post.new({id: 1});
        comment = post.comments.new({id: 2});

        expect(post.comments).toContain(comment);
      });

      it("initializes both sides of the association", function() {
        comment = Comment.new({id: 1});
        post    = Post.new({id: 1, comments: comment});

        expect(post.comments.first().post).toBe(post);
      });

      it("does not add instances to the associated collection unless they have a primary key", function() {
        post    = Post.new({id: 1});
        comment = post.comments.new();

        expect(post.comments).not.toContain(comment);
      });
    });

    describe("#$create", function() {
      it("creates and saves associated instances via `$create` method", function() {
        backend.whenPOST("https://api.edmodo.com/comments.json")
               .respond(200, {id: 2, body: "Great post!", post_id: 1});

        post    = Post.new({id: 1});
        comment = post.comments.$create({body: "Great post!"});

        backend.flush();

        expect(comment.post).toEqual(post);
        expect(post.comments).toContain(comment);
      });
    });

    describe("#where", function() {
      it("queries the association", function() {
        backend.whenGET("https://api.edmodo.com/comments.json?post_id=1")
               .respond(200, [{id: 2, body: "Great post!", post_id: 1},
                              {id: 3, body: "Awesome!", post_id: 1}]);

        post     = Post.new({id: 1});
        comments = post.comments.where({});

        backend.flush();

        expect(comments.first().post).toEqual(post);
        expect(comments.last().post).toEqual(post);
        expect(post.comments.first().id).toEqual(2);
        expect(post.comments.last().id).toEqual(3);
      });
    });

    describe("#findAll", function() {
      it("is like #where with no arguments", function() {
        backend.whenGET("https://api.edmodo.com/comments.json?post_id=1")
               .respond(200, [{id: 2, body: "Great post!", post_id: 1},
                              {id: 3, body: "Awesome!", post_id: 1}]);

        post     = Post.new({id: 1});
        comments = post.comments.findAll();

        backend.flush();

        expect(comments.first().post).toEqual(post);
        expect(comments.last().post).toEqual(post);
        expect(post.comments.first().id).toEqual(2);
        expect(post.comments.last().id).toEqual(3);
      });
    });
  });

  describe("BelongsTo", function() {
    it("initializes belongsTo association", function() {
      post    = Post.new({id: 1});
      comment = Comment.new({id: 1, post: post});

      expect(comment.post).toBe(post);
    });

    it("initializes belongsTo via foreign key", function() {
      post    = Post.new({id: 1});
      comment = Comment.new({id: 1, post_id: post.id});

      expect(comment.post).toBe(post);
    });

    it("initializes both sides of the association", function() {
      post    = Post.new({id: 1});
      comment = Comment.new({id: 1, post_id: post.id});

      expect(comment.post.comments).toContain(comment);
    });
  });
});
