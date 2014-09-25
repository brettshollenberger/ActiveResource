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

      it("adds instances to collection associations on save if they contain a primary key", function() {
        backend.expectPOST("https://api.edmodo.com/comments.json")
               .respond({id: 2, post_id: 1});

        post    = Post.new({id: 1});
        comment = post.comments.new();
        expect(post.comments).not.toContain(comment);

        comment.$save();
        backend.flush();

        expect(post.comments).toContain(comment);
      });

      it("adds instances to collection associations on update if they contain a primary key", function() {
        post    = Post.new({id: 1});
        comment = post.comments.new();
        expect(post.comments).not.toContain(comment);

        comment.update({id: 1});

        expect(post.comments).toContain(comment);
      });

      it("configures addition of instance to collection association without primary key", function() {
        Comment.belongsTo("post", {includeWithoutPrimaryKey: true});

        post    = Post.new({id: 1});
        comment = post.comments.new();
        expect(post.comments).toContain(comment);
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
        backend.whenGET("https://api.edmodo.com/comments.json?page=1&post_id=1")
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
        backend.whenGET("https://api.edmodo.com/comments.json?page=1&post_id=1")
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

  describe("Edge cases", function() {

    beforeEach(function() {
      backend.whenGET("https://api.edmodo.com/schools.json?district_id=1&page=1")
             .respond(200, [{id: 17900, name: "Edmodo High", district_id: 1}]);

      backend.whenGET("https://api.edmodo.com/districts/1.json")
             .respond(200, {id: 1, name: "Edmodo District"});

      backend.whenGET("https://api.edmodo.com/users.json?district_id=1&page=1")
             .respond(200, [{id: 250, name: "Bert Wellington", district: {id: 1},
                            school: {id: 17900}}]);
    });

    it("initializes multiple associations on the same instance", function() {
      var district = District.find(1);
      backend.flush();
      var schools  = School.where({district_id: 1});
      backend.flush();
      var members  = Member.where({district_id: 1});
      backend.flush();

      expect(members.first().school).toEqual(schools.first());
      expect(members.first().district).toEqual(district);
    });
  });

  describe("Self joins", function() {
    var directory, file;
    beforeEach(function() {
      backend.whenGET("https://api.edmodo.com/files/1.json")
              .respond(200, {id: 1, name: "Top Level Dir"});

      backend.whenGET("https://api.edmodo.com/files.json?page=1&parent_id=1")
              .respond(200, [{id: 2, name: "File", parent_id: 1}]);

      directory = File.find(1).then(function() {
        directory.files.findAll().then(function() {
          file = directory.files.first();
        });
      });

      backend.flush();
    });

    it("successfully self joins", function() {
      expect(directory.files).toContain(file);
      expect(file.parent).toEqual(directory);
    });
  });
});
