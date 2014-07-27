describe("ARFindable", function() {
  beforeEach(function() {
    backend.whenGET("https://api.edmodo.com/posts/1.json").respond({id: 1, title: "My Great Post"});

    backend.whenGET("https://api.edmodo.com/posts.json?author_id=1")
      .respond([{id: 1, title: "My Great Post", author_id: 1},
                {id: 2, title: "Joan of Shark", author_id: 1}], {}, 200);
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

  it("queries the backend for instances otherwise", function() {
    var post = Post.find(1);
    backend.flush();
    expect(post.title).toEqual("My Great Post");
    expect(Post.cached[1]).toEqual(post);
  });

  it("takes a promise and returns the instance", function() {
    var post = Post.find(1).then(function(response) {});

    backend.flush();

    expect(post.id).toEqual(1);
  });

  it("finds multiple instances", function() {
    var posts = Post.where({author_id: 1});
    backend.flush();

    expect(posts.first().id).toEqual(1);
  });

  it("transforms the json into model instances", function() {
    var posts = Post.where({author_id: 1});
    backend.flush();

    expect(posts.first().constructor).toEqual(Post);
  });

  it("saves the response to the query", function() {
    var posts = Post.where({author_id: 1});
    backend.flush();

    expect(Post.queryCache.find({author_id:1})).toEqual(posts);
  });
});
