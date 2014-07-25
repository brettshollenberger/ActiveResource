describe("ARReflection", function() {
  describe("HasManyReflections", function() {
    it("creates hasMany reflections", function() {
      expect(Post.reflections.comments.constructor.name).toEqual("HasManyReflection");
    });

    it("finds the class of the reflection", function() {
      expect(Post.reflections.comments.klass).toEqual(Comment);
    });

    it("has no foreign key", function() {
      expect(Post.reflections.comments.foreignKey).toBeUndefined();
    });

    it("returns the primary key of the association", function() {
      Comment.primaryKey = "_id";

      expect(Post.reflections.comments.associationPrimaryKey()).toEqual("_id");
    });

    it("returns the inverse reflection", function() {
      expect(Post.reflections.comments.inverse()).toEqual(Comment.reflections.post);
    });

    it("finds the inverse reflection when its name is not typical", function() {
      expect(Collection.reflections.hats.inverse()).toEqual(Hat.reflections.collection);
    });

    it("maintains the name of the macro used to build the reflection", function() {
      expect(Post.reflections.comments.macro).toEqual("hasMany");
      expect(Collection.reflections.hats.macro).toEqual("hasMany");
    });

    it("contains helper methods to determine the macro assertively", function() {
      expect(Post.reflections.comments.isHasMany()).toEqual(true);
      expect(Post.reflections.comments.isBelongsTo()).toEqual(false);
    });

    it("reflects on all associations of a given macro type", function() {
      expect(Post.reflectOnAllAssociations()).toEqual(Post.reflections);
      expect(Post.reflectOnAllAssociations("hasMany")).toEqual(Post.reflections.where(function(r) {
        return r.macro == "hasMany";
      }).toObject(function(rs, r) {
        rs[r.name] = r;
      }));
    });

    it("describes whether or not an association is instantiated", function() {
      expect(Post.reflections.comments.containsAssociation({}, {})).toEqual(false);
    });

    it("initializes the association", function() {
      var post    = Post.new({id: 1});
      var comment = Comment.new({id: 1});
      Post.reflections.comments.initialize(post, {comments: comment});

      expect(post.comments).toContain(comment);
    });
  });

  describe("BelongsToReflections", function() {
    it("creates belongsTo reflections", function() {
      expect(Comment.reflections.post.constructor.name).toEqual("BelongsToReflection");
    });

    it("finds the class of the reflection", function() {
      expect(Comment.reflections.post.klass).toEqual(Post);
    });

    it("has a default foreign key", function() {
      expect(Comment.reflections.post.foreignKey).toEqual("post_id");
    });

    it("returns the primary key of the association", function() {
      Post.primaryKey = "p_id";

      expect(Comment.reflections.post.associationPrimaryKey()).toEqual("p_id");
    });

    it("returns the inverse reflection", function() {
      expect(Comment.reflections.post.inverse()).toEqual(Post.reflections.comments);
    });

    it("maintains the name of the macro used to build the reflection", function() {
      expect(Comment.reflections.post.macro).toEqual("belongsTo");
    });

    it("contains helper methods to determine the macro assertively", function() {
      expect(Comment.reflections.post.isHasMany()).toEqual(false);
      expect(Comment.reflections.post.isBelongsTo()).toEqual(true);
    });
  });
});
