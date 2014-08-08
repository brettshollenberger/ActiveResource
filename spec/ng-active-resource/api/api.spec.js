describe('ARAPI', function() {
  describe("api#generateRequest", function() {
    it("parameterizes params that exist on instances and updates the config", function() {
      var config = {params: {id: 1}},
          url    = Post.api.generateRequest("show", config);

      expect(url).toEqual("https://api.edmodo.com/posts/1.json");
      expect(config.params).toBeUndefined();
    });

    it("replaces any params and updates the config", function() {
      Post.api.configure(function(config) {
        config.showURL = "/posts/:title";
      });

      var config = {params: {id: 1, title: "The Abstractions Are Leaking!"}},
          url    = Post.api.generateRequest("show", config);

      expect(url)
        .toEqual("https://api.edmodo.com/posts/The Abstractions Are Leaking!.json");

      expect(config.params).toEqual({ id: 1 });
    });

    it("chains in parent resource URLs", function() {
      Post.api.configure(function(config) {
        config.nestedURL         = "authors/:author_id";
        config.showURL           = "posts/:title";
        config.parameterizeTitle = function(title) {
          return title.split(" ").join("-").toLowerCase().replace(/[\!\?]/g, '');
        }
      });

      var config = {params: {id: 1, title: "My Great Post", author: {id: 2}}},
          url    = Post.api.generateRequest("show", config);

      expect(url)
        .toEqual("https://api.edmodo.com/authors/2/posts/my-great-post.json");

      expect(config.params).toEqual({ id: 1 });
    });

    it("serializes associations to replace params", function() {
      Comment.api.configure(function(config) {
        config.baseURL = "http://api.edmodo.com/posts/:post_id";
      });

      var config = {params: {published: true, post: {id: 2}}},
          url    = Comment.api.generateRequest("index", config);

      expect(url)
        .toEqual("http://api.edmodo.com/posts/2/comments.json");

      expect(config.params).toEqual({published: true});
    });

    it("does not replace port numbers", function() {
      Comment.api.configure(function(config) {
        config.baseURL = "http://localhost:3000/posts/:post_id";
      });

      var config = { params: {published: true, post: {id: 2}}},
          url    = Comment.api.generateRequest("index", config);

      expect(url)
        .toEqual("http://localhost:3000/posts/2/comments.json");

      expect(config.params).toEqual({published: true});
    });

    it("checks parameterizePARAM function to parameterize", function() {
      Post.api.showURL = "/posts/:title";

      Post.api.parameterizeTitle = function(title) {
        return title.split(" ").join("-").toLowerCase().replace(/[\!\?]/g, '');
      }

      var config = { params:  {title: "The Abstractions Are Leaking!"}},
          url    = Post.api.generateRequest("show", config);

      expect(url)
        .toEqual("https://api.edmodo.com/posts/the-abstractions-are-leaking.json");

      expect(config.params).toBeUndefined({});
    });

    it("updates the config with parameters to append to the query string", function() {
      var config = { params: {id: 1, author_id: 1, public: true}},
          url    = Post.api.generateRequest("show", config);

      expect(url).toEqual(
        "https://api.edmodo.com/posts/1.json");

      expect(config.params).toEqual({
        author_id: 1,
        public: true
      });

      config = { params: {author_id: 1, public: true}};
      url    = Post.api.generateRequest("index", config);

      expect(url)
        .toEqual("https://api.edmodo.com/posts.json");

      expect(config.params).toEqual({
        author_id: 1,
        public: true
      });
    });

    it("parameterizes for delete", function() {
      var config = { params: {id: 1, public: true}},
          url    = Post.api.generateRequest("delete", config)

      expect(url)
        .toEqual("https://api.edmodo.com/posts/1.json");

      expect(config.params).toEqual({public: true});
    });

    it("parameterizes for update", function() {
      var config = { params: {id: 1, public: true}},
          url    = Post.api.generateRequest("update", config)

      expect(url)
        .toEqual("https://api.edmodo.com/posts/1.json");

      expect(config.params).toEqual({public: true});
    });

    it("does not parameterize url for creates", function() {
      var config = { params: {id: 1, public: true}},
          url    = Post.api.generateRequest("create", config)

      expect(url)
        .toEqual("https://api.edmodo.com/posts.json");

      expect(config.params).toEqual({id: 1, public: true});
    });
  });

  describe("Format", function() {
    it("appends formats", function() {
      var config = {},
          url    = Post.api.generateRequest("index", config);

      expect(url).toEqual("https://api.edmodo.com/posts.json");
    });
  });

  describe("Configuration", function() {
    it("can be configured not to append format", function() {
      Post.api.configure(function(api) {
        api.appendFormat = false;
      });

      expect(Post.api.generateRequest("index", {})).toEqual("https://api.edmodo.com/posts");
    });

    it("can be configured at a global level", function() {
      API.configure(function(config) {
        config.baseURL = "https://api.edmodo.com";
        config.format  = "text/xml";
      });

      function Member() {}
      Member.inherits(ngActiveResource.Base);

      Member.api.configure(function(config) {
        config.resource = "user";
      });

      expect(Member.api.generateRequest("index", {})).toEqual("https://api.edmodo.com/users.xml");
    });

    it("is overridden by model-specific configuration", function() {
      ngActiveResource.api.configure(function(config) {
        config.baseURL      = "https://api.edmodo.com/v1";
        config.format       = "text/xml";
        config.appendFormat = false;
      });

      function User() {}
      User.inherits(ngActiveResource.Base);

      expect(User.api.generateRequest("index", {})).toEqual("https://api.edmodo.com/v1/users");
      expect(Post.api.generateRequest("index", {})).toEqual("https://api.edmodo.com/posts.json");
    });
  });
});
