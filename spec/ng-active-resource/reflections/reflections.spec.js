ddescribe("ARReflection", function() {

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
  });
});
