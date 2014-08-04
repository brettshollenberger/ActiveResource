describe("ARPrimaryKey", function() {
  it("defaults to id", function() {
    expect(Post.primaryKey).toEqual("id");
  });

  it("adds primary keys during instance creation", function() {
    var post = Post.new({id: 1});
    expect(post.id).toBe(1);
  });

  it("overrides the default primary key", function() {
    Post.primaryKey = "_id";
    var post = Post.new({id: 1, _id: 2});
    expect(post._id).toEqual(2);
    expect(post.id).toBeUndefined();
  });
});
