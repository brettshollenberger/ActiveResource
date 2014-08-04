describe("ARDirty", function() {
  var post;
  beforeEach(function() {
    post = Post.new({id: 1});

    backend.whenPUT("https://api.edmodo.com/posts/1.json")
           .respond(200, {id: 1});
  });

  it("lists changed attributes", function() {
    expect(post.changedAttributes()).toEqual(['id']);
  });

  it("is dirty if attributes have changed since last save", function() {
    expect(post.dirty()).toEqual(true);
  });

  it("is not dirty if attributes have not changed since last save", function() {
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

  it("is not dirty if attributes are fundamentally unchanged", function() {
    post.$save();
    backend.flush();

    post.title = "";

    expect(post.dirty()).toBe(false);

    post.title = "Cool Post";
    post.$save();
    backend.flush();

    post.title = "";

    expect(post.changedAttributes()).toEqual(["title"]);
    expect(post.dirty()).toBe(true);
  });

  it("is not dirty if numbers and strings are compared", function() {
    post.$save();
    backend.flush();

    post.id = "1";
    expect(post.dirty()).toBe(false);
  });

  it("compares boolean values", function() {
    post.published = true;
    post.$save();
    backend.flush();

    post.published = "true";
    expect(post.dirty()).toBe(false);

    post.published = false;
    expect(post.dirty()).toBe(true);
  });

  it("compares objects", function() {
    post.meta = {
      format: "html"
    }

    post.$save();
    backend.flush();

    post.meta = {
      format: "xml"
    }

    expect(post.dirty()).toEqual(true);

    post.meta = "";

    expect(post.dirty()).toEqual(true);

    post.meta = {
      format: "html"
    }

    expect(post.dirty()).toEqual(false);
  });

  it("compares arrays", function() {
    post.tags = ["one", "two", "three", "schfoor"];
    post.$save();
    backend.flush();

    post.tags = ["fun", "two"];
    expect(post.dirty()).toEqual(true);

    post.tags = ["one", "two", "three", "schfoor"];
    expect(post.dirty()).toEqual(false);
  });
});