describe('ARAssociatable', function() {
  describe("class#hasMany", function() {
    it("adds hasMany association to class", function() {
      expect(_.keys(Post.associations.hasMany)).toContain("comments");
    });

    it("intuits name of associated class by default", function() {
      expect(Post.associations.hasMany.comments.klass).toEqual(Comment);
    });

    it("finds associated provider by named argument", function() {
      expect(Person.associations.hasMany.hats.klass).toEqual(Hat);
    });
  });

  describe("class#belongsTo", function() {
    it("adds belongsTo association to class", function() {
      expect(_.keys(Comment.associations.belongsTo)).toContain("post");
    });

    it("overrides provider name if provided", function() {
      expect(Hat.associations.belongsTo.collection.klass).toEqual(Collection);
    });

    it("adds foreign key to association", function() {
      expect(Comment.associations.belongsTo.post.foreignKey).toContain("post_id");
    });

    it("overrides foreign key if provided", function() {
      expect(Hat.associations.belongsTo.person.foreignKey).toContain("user_id");
    });
  });
});
