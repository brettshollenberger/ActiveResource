describe("ARHTTPConfig", function() {
  beforeEach(function() {
    API.configure(function(config) {
      config.params = {
        api_token: "1234"
      }
    });

    backend.whenGET("https://api.edmodo.com/posts/1.json?api_token=1234")
      .respond(200, {id: 1, title: "My Great Post", author_id: 1}, {});

    backend.whenGET("https://api.edmodo.com/posts/1.json?api_token=1234&published=true")
      .respond(200, {id: 1, title: "My Great Post", author_id: 1}, {});

    backend.whenGET("https://api.edmodo.com/posts/1.json?api_token=5678")
      .respond(200, {id: 1, title: "My Great Post", author_id: 1}, {});

    backend.whenPOST("https://api.edmodo.com/posts.json?api_token=1234")
      .respond(200, {id: 1, title: "My Great Post", author_id: 1}, {});

    spyOn($http, "get").andCallThrough();
    spyOn($http, "post").andCallThrough();
  });

  it("adds default params to requests", function() {
    var post = Post.find(1);

    backend.flush();

    expect($http.get.mostRecentCall.args[1].params).toEqual({api_token: "1234"});
  });

  it("adds additional params to calls", function() {
    var post = Post.find(1, {params: {published: true}});

    backend.flush();

    expect($http.get.mostRecentCall.args[1].params).toEqual({published: true, api_token: "1234"});
  });

  it("overrides defaults on individual APIs", function() {
    Post.api.configure(function(config) {
      config.params = {
        api_token: "5678"
      }
    });

    var post = Post.find(1);

    backend.flush();

    expect($http.get.mostRecentCall.args[1].params).toEqual({api_token: "5678"});
  });

  it("uses params on all actions", function() {
    var post = Post.$create({title: "My Great Title"});

    backend.flush();

    expect($http.post.mostRecentCall.args[2].params).toEqual({api_token: "1234"});
  });
});
