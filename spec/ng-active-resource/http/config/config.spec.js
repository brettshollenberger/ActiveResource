describe("ARHTTPConfig", function() {
  beforeEach(function() {
    Post.api.configure(function(config) {
      config.data = {
        api_token: "1234"
      }
    });

    backend.whenGET("https://api.edmodo.com/posts/1.json")
      .respond(200, {id: 1, title: "My Great Post", author_id: 1}, {});

    spyOn($http, "get").andCallThrough();
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
});
