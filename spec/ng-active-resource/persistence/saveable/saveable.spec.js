describe("ARSaveable", function() {
  describe("Saving new instances", function() {
    var post;
    beforeEach(function() {
      backend.whenPOST("https://api.edmodo.com/posts.json").respond(200, {
        id: 1,
        title: "My Great Title",
        content: "Wow, what a great post"
      });

      spyOn($http, "post").andCallThrough();

      post         = Post.new();
      post.content = "Wow, what a great post";
      post.$save({title: "My Great Title"});

      backend.flush();
    });

    it("calls the createURL if the instance has no primary key", function() {
      expect($http.post.mostRecentCall.args[0]).toEqual("https://api.edmodo.com/posts.json");
    });

    it("serializes data", function() {
      expect($http.post.mostRecentCall.args[2].data).toEqual(
        '{"title":"My Great Title","content":"Wow, what a great post"}'
      );
    });

    it("serializes to the format of the API", function() {
      Post.api.configure(function(config) {
        config.format = "xml";
      });

      backend.whenPUT("https://api.edmodo.com/posts/1.xml").respond(200, {
        id: 1,
        title: "My Great Title",
        content: "Wow, what a great post"
      });

      spyOn($http, "put").andCallThrough();
      post.$save();
      backend.flush();

      expect($http.put.mostRecentCall.args[2].data).toEqual(
        '<title>My Great Title</title><author_id/><commentCount/><public/><id>1</id><content>Wow, what a great post</content>'
      );
    });

    it("updates the instance with results from the API", function() {
      expect(post.id).toEqual(1);
    });
  });

  describe("Saving instances with primary keys", function() {
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
      post.$save({id: 1, title: "My Great Title"});

      backend.flush();
    });

    it("calls the updateURL if the instance has a primary key", function() {
      expect($http.put.mostRecentCall.args[0]).toEqual("https://api.edmodo.com/posts/1.json");
    });

    it("updates the instance with results from the API", function() {
      expect(post.title).toEqual("Your Great Title");
    });
  });

  describe("Deserializing responses from the API", function() {
    var post;
    beforeEach(function() {
      Post.api.configure(function(config) {
        config.format     = "xml";
        config.unwrapRoot = true;
      });

      backend.whenPOST("https://api.edmodo.com/posts.xml").respond(
        "<post>" +
          "<id>1</id>" +
          "<title>My Great Title</title>" +
          "<content>Wow, what a great post</content>" +
        "</post>"
      );

      spyOn($http, "post").andCallThrough();

      post = Post.new();
      post.content = "Wow, what a great post";
      post.$save({title: "My Great Title"});

      backend.flush();
    });

    it("calls the xml endpoint", function() {
      expect($http.post.mostRecentCall.args[0]).toEqual("https://api.edmodo.com/posts.xml");
    });

    it("deserializes the format", function() {
      expect(post.id).toEqual(1);
    });
  });

  describe("Automatic associations", function() {
    var post, comment;
    beforeEach(function() {
      backend.whenPOST("https://api.edmodo.com/comments.json").respond(200, {
        id: 1,
        body: "good comment",
        post_id: 1
      });

      spyOn($http, "post").andCallThrough();

      post    = Post.new({id: 1});
      comment = Comment.$create({body: "good comment"});

      backend.flush();
    });

    it("automatically associates the relationships", function() {
      expect(comment.post).toEqual(post);
      expect(post.comments).toContain(comment);
    });
  });

  describe("Save Config", function() {
    var post;
    beforeEach(function() {
      backend.whenPOST("https://api.edmodo.com/posts.json").respond({
        id: 1,
        title: "My Great Title",
        content: "Wow, what a great post"
      });

      spyOn($http, "post").andCallThrough();

      post = Post.new();
      post.content = "Wow, what a great post";
      post.$save({title: "My Great Title"}, {
        headers: {
          "Content-Type": "text/xml"
        }
      });

      backend.flush();
    });

    it("overrides individual headers", function() {
      expect($http.post.mostRecentCall.args[2].headers).toEqual({
        'Content-Type' : 'text/xml',
        'Accept' : 'application/json' 
      });
    });
  });

  describe("Data Hook", function() {
    var post;
    beforeEach(function() {
      backend.whenPOST("https://api.edmodo.com/posts.json").respond(200, {
        data: {
          id: 1,
          title: "My Great Title",
          content: "Wow, what a great post"
        }
      });

      spyOn($http, "post").andCallThrough();

      post = Post.new();
      post.content = "Wow, what a great post";
      post.$save({title: "My Great Title"});

      Post.data("save", function(response) {
        response.data = response.data.data;
      });

      backend.flush();
    });

    it("defines a callback for when data is received", function() {
      expect(post.id).toEqual(1);
    });
  });

  describe("Error Handling", function() {
    var post, error, status;
    beforeEach(function() {
      backend.whenPOST("https://api.edmodo.com/posts.json").respond(500, {
        error: "Backend overloaded"
      });

      spyOn($http, "post").andCallThrough();

      post = Post.new();
      post.content = "Wow, what a great post";
      post.$save({title: "My Great Title"});

      Post.fail("save", function(deferred, response, params) {
        error  = response.error;
        status = response.status;
      });

      backend.flush();
    });

    it("triggers fail callbacks", function() {
      expect(status).toEqual(500);
      expect(error).toEqual("Backend overloaded");
    });

    it("rejects invalid instances without saving", function() {
      var errors;

      Post.validates({
        title: { required: true }
      });

      post.title = undefined;
      post.$save().catch(function(err) {
        errors = err;
      });

      $timeout.flush();

      expect(errors).toEqual(post.$errors);
    });
  });
});
