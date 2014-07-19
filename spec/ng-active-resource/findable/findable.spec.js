describe("ARFindable", function() {
  beforeEach(function() {
    backend.whenGET("https://api.edmodo.com/posts/1.json").respond({id: 1, title: "My Great Post"});
  });

  it("finds cached instances if they exist already in the system", function() {
    var post      = Post.new({id: 1});
    var foundPost = Post.find(1);

    expect(foundPost).toEqual(post);
  });

  it("finds using a hash of attributes", function() {
    var post      = Post.new({id: 1});
    var foundPost = Post.find({id: 1});

    expect(foundPost).toEqual(post);
  });

  it("queries the backend for instances otherwise", function() {
    var post = Post.find(1);
    backend.flush();
    expect(post.title).toEqual("My Great Post");
    expect(Post.cached[1]).toEqual(post);
  });
});
