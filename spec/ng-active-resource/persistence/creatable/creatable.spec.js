describe("ARCreatable", function() {
  it("creates new instances", function() {
    var post = Post.new();
    expect(post instanceof Post).toBe(true);
  });

  it("creates & saves new instances", function() {
    backend.whenPOST("https://api.edmodo.com/posts.json").respond(200, {
      id: 1,
      title: "My Great Title",
      content: "Wow, what a great post"
    });

    spyOn($http, "post").andCallThrough();

    var post = Post.$create({title: "My Great Title"});

    backend.flush();

    expect(post.id).toEqual(1);
    expect($http.post.mostRecentCall.args[0]).toEqual('https://api.edmodo.com/posts.json');
  });

  it("grabs associations", function() {
    backend.whenPOST("https://api.edmodo.com/comments.json").respond(200, {
      id: 1,
      body: "Wow, what a great post!",
      post_id: 1
    });

    var post    = Post.new({id: 1});
    var comment = Comment.$create({body: "My Great Title", post_id: 1});

    backend.flush();

    expect(comment.post).toEqual(post);
    expect(post.comments).toContain(comment);
  });
});
