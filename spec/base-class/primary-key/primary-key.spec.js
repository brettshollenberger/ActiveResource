describe("BCPrimaryKey", function() {
  it("defaults to id", function() {
    expect(Post.primaryKey).toEqual("id");
  });
});
