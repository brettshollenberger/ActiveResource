describe('ARAssociatable', function() {
  describe("class#hasMany", function() {
    it("adds hasMany association to class", function() {
      expect(_.keys(Post.associations)).toContain("comments");
    });

    it("intuits name of associated class by default", function() {
      expect(Post.associations.comments.klass).toEqual(Comment);
    });

    it("finds associated provider by named argument", function() {
      expect(Person.associations.hats.klass).toEqual(Hat);
    });

    describe("Creating associations", function() {
      var post;
      beforeEach(function() {
         post = Post.new({});
      });

      it("creates empty hasMany association", function() {
        expect(post.comments).toEqual([]);
      });

      it("adds associations with new", function() {
        var comment = post.comments.new({});
        expect(post.comments).toContain(comment);
      });

      it("associates itself with new instances", function() {
        var comment = post.comments.new({});
        expect(comment.post).toEqual(post);
      });
    });
  });

  describe("class#belongsTo", function() {
    it("adds belongsTo association to class", function() {
      expect(_.keys(Comment.associations)).toContain("post");
    });

    it("overrides provider name if provided", function() {
      expect(Hat.associations.collection.klass).toEqual(Collection);
    });

    it("adds foreign key to association", function() {
      expect(Comment.associations.post.foreignKey).toContain("post_id");
    });

    it("overrides foreign key if provided", function() {
      expect(Hat.associations.person.foreignKey).toContain("user_id");
    });
  });
});
