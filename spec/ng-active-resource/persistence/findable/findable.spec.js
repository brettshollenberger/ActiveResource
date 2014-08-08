describe("ARFindable", function() {
  beforeEach(function() {
    backend.whenGET("https://api.edmodo.com/posts/1.json")
      .respond({id: 1, title: "My Great Post"});

    backend.whenGET("https://api.edmodo.com/posts/1.xml")
      .respond(200, "<post><id>1</id><title>My Great Post</title></post>");

    backend.whenGET("https://api.edmodo.com/comments/1.json")
      .respond({id: 1, post_id: 1});
  });

  it("finds cached instances if they exist already in the system", function() {
    var post      = Post.new({id: 1});
    var foundPost = Post.find(1);

    expect(foundPost).toEqual(post);
  });

  it("finds using a hash of attributes", function() {
    var post      = Post.new({id: 1});
    var foundPost = Post.find({id: 1})

    expect(foundPost).toEqual(post);
  });

  it("finds using a non-standard key", function() {
    backend.expectGET("https://api.edmodo.com/posts/my-great-title.json")
           .respond(200, {id: 1, title: "My Great Title"});

    Post.api.configure(function(config) {
      config.showURL = "posts/:title";

      config.parameterizeTitle = function() {
        return "my-great-title";
      }
    });

    var post = Post.find({title: "My Great Title"});
    backend.flush();

    expect(post.id).toEqual(1);
    expect(post.title).toEqual("My Great Title");
  });

  it("queries the backend for instances otherwise", function() {
    var post = Post.find(1);
    backend.flush();
    expect(post.title).toEqual("My Great Post");
    expect(Post.cached[1]).toEqual(post);
  });

  it("deserializes backend responses", function() {
    Post.api.configure(function(config) {
      config.format     = "xml";
      config.unwrapRoot = true;
    });

    var post = Post.find(1);

    backend.flush();

    expect(post.id).toEqual(1);
    expect(post.title).toEqual("My Great Post");
  });

  it("takes a promise and returns the instance", function() {
    var post = Post.find(1).then(function(response) {});

    backend.flush();

    expect(post.id).toEqual(1);
  });

  it("grabs associations", function() {
    var post    = Post.new({id: 1});
    var comment = Comment.find(1);

    backend.flush();

    expect(comment.post).toEqual(post);
    expect(post.comments).toContain(comment);
  });
});
