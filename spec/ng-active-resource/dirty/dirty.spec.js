describe("ARDirty", function() {
  var post;
  beforeEach(function() {
    post = Post.new({id: 1});
  });

  it("lists changed attributes", function() {
    expect(post.changedAttributes()).toEqual(['id']);
  });

  it("is dirty if attributes have changed since last save", function() {
    expect(post.dirty()).toEqual(true);
  });

  it("is not dirty if attributes have not changed since last save", function() {
    backend.whenPUT("https://api.edmodo.com/posts/1.json")
           .respond(200, {id: 1});

    post.$save();

    backend.flush();

    expect(post.changedAttributes()).toEqual([]);
    expect(post.dirty()).toEqual(false);

    post.update({title: "My Great Title"});

    expect(post.changedAttributes()).toEqual(["title"]);
    expect(post.dirty()).toEqual(true);

    post.$save();

    backend.flush();

    expect(post.changedAttributes()).toEqual([]);
    expect(post.dirty()).toEqual(false);
  });
});
