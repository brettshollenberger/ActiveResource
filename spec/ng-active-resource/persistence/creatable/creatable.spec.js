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
    expect($http.post).toHaveBeenCalledWith('https://api.edmodo.com/posts.json', { 
      headers : { 
        'Content-Type' : 'application/json', 
        'Accept' : 'application/json' 
      } 
    });
  });
});
