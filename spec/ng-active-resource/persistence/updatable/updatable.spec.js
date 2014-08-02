describe("ARUpdatable", function() {
  it("updates on the client side", function() {
    var post = Post.new();
    post.update({id: 1, title: "My Great Post"});

    expect(post.id).toEqual(1);
    expect(post.title).toEqual("My Great Post");
  });

  it("sets associations with foreign keys", function() {
    var post    = Post.new({id: 1});
    var comment = Comment.new();

    comment.update({post_id: 1});

    expect(comment.post).toEqual(post);
  });

  describe("Updating on the server", function() {
    var post;
    beforeEach(function() {
      backend.whenPUT("https://api.edmodo.com/posts/1.json").respond({
        id: 1,
        title: "Your Great Title",
        content: "Wow, what a great post"
      });

      spyOn($http, "put").andCallThrough();

      post = Post.new();
      post.content = "Wow, what a great post";
      post.$update({id: 1, title: "My Great Title"});

      backend.flush();
    });

    it("calls the updateURL if the instance has a primary key", function() {
      expect($http.put.mostRecentCall.args[0]).toEqual("https://api.edmodo.com/posts/1.json");
    });

    it("updates the instance with results from the API", function() {
      expect(post.title).toEqual("Your Great Title");
    });
  });
});
