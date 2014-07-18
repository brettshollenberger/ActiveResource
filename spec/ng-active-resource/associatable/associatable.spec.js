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
});
