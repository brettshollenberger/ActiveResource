describe("ARCreatable", function() {
  it("creates new instances", function() {
    var post = Post.new();
    expect(post instanceof Post).toBe(true);
  });
});
