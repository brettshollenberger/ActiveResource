describe("ARSaveable", function() {
  describe("Saving new instances", function() {
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
      post.$save({title: "My Great Title"});

      backend.flush();
    });

    it("calls the createURL if the instance has no primary key", function() {
      expect($http.post).toHaveBeenCalledWith("https://api.edmodo.com/posts.json");
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
      expect($http.put).toHaveBeenCalledWith("https://api.edmodo.com/posts/1.json");
    });

    it("updates the instance with results from the API", function() {
      expect(post.title).toEqual("Your Great Title");
    });
  });

  describe("Deserializing responses from the API", function() {
    var post;
    beforeEach(function() {
      Post.api.configure(function(config) {
        config.format            = "xml";
        config.unwrapRootElement = true;
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
      expect($http.post).toHaveBeenCalledWith("https://api.edmodo.com/posts.xml");
    });

    it("deserializes the format", function() {
      expect(post.id).toEqual(1);
    });
  });
});
