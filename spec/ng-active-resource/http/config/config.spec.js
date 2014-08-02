describe("ARHTTPConfig", function() {
  beforeEach(function() {
    API.configure(function(config) {
      config.data = {
        api_token: "1234"
      }
    });

    backend.whenGET("https://api.edmodo.com/posts/1.json")
      .respond(200, {id: 1, title: "My Great Post", author_id: 1}, {});

    backend.whenPOST("https://api.edmodo.com/posts.json")
      .respond(200, {id: 1, title: "My Great Post", author_id: 1}, {});

    spyOn($http, "get").andCallThrough();
    spyOn($http, "post").andCallThrough();
  });

  it("adds default data to requests", function() {
    var post = Post.find(1);

    backend.flush();

    expect($http.get.mostRecentCall.args[1].data).toEqual({api_token: "1234"});
  });

  it("adds additional data to calls", function() {
    var post = Post.find(1, {data: {published: true}});

    backend.flush();

    expect($http.get.mostRecentCall.args[1].data).toEqual({published: true, api_token: "1234"});
  });

  it("overrides defaults on individual APIs", function() {
    Post.api.configure(function(config) {
      config.data = {
        api_token: "5678"
      }
    });

    var post = Post.find(1);

    backend.flush();

    expect($http.get.mostRecentCall.args[1].data).toEqual({api_token: "5678"});
  });

  xit("uses data on all actions", function() {
    var post = Post.$create({title: "My Great Title"});

    backend.flush();

    expect($http.post.mostRecentCall.object()).toEqual({api_token: "1234"});
  });
});
