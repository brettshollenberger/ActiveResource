describe('ARAPI', function() {
  describe("api#get", function() {
    it("parameterizes params that exist on instances", function() {
      expect(Post.api().get("show", {id: 1})).toEqual("https://api.edmodo.com/posts/1.json");
    });

    it("replaces any params", function() {
      Post.api().showURL = "/posts/:title";

      expect(Post.api().get("show", {id: 1, title: "The Abstractions Are Leaking!"}))
        .toEqual("https://api.edmodo.com/posts/The Abstractions Are Leaking!.json?id=1");
    });

    it("checks parameterizePARAM function to parameterize", function() {
      Post.api().showURL = "/posts/:title";

      Post.api().parameterizeTitle = function(title) {
        return title.split(" ").join("-").toLowerCase().replace(/[\!\?]/g, '');
      }

      expect(Post.api().get("show", {title: "The Abstractions Are Leaking!"}))
        .toEqual("https://api.edmodo.com/posts/the-abstractions-are-leaking.json");
    });

    it("appends a query string with the rest of the parameters for GET type URLs", function() {
      expect(Post.api().get("show", {id: 1, author_id: 1, public: true})).toEqual(
        "https://api.edmodo.com/posts/1.json?author_id=1&public=true");

      expect(Post.api().get("index", {author_id: 1, public: true}))
        .toEqual("https://api.edmodo.com/posts.json?author_id=1&public=true");
    });

    it("only parameterizes params for delete action", function() {
      expect(Post.api().get("delete", {id: 1, public: true}))
        .toEqual("https://api.edmodo.com/posts/1.json");
    });

    it("only parameterizes params for update action", function() {
      expect(Post.api().get("update", {id: 1, public: true}))
        .toEqual("https://api.edmodo.com/posts/1.json");
    });

    it("appends no query string for create action", function() {
      expect(Post.api().get("create", {id: 1, public: true}))
        .toEqual("https://api.edmodo.com/posts.json");
    });
  });

  describe("Format", function() {
    it("appends formats", function() {
      expect(Post.api().get("index", {})).toEqual("https://api.edmodo.com/posts.json");
    });
  });

  describe("Configuration", function() {
    it("can be configured not to append format", function() {
      Post.api().configure(function(api) {
        api.appendFormat = false;
      });

      expect(Post.api().get("index", {})).toEqual("https://api.edmodo.com/posts");
    });

    it("can be configured at a global level", function() {
      API.configure(function(config) {
        config.baseURL = "https://api.edmodo.com";
        config.format  = "text/xml";
      });

      function Member() {}
      Member.inherits(ngActiveResource.Base);

      Member.api().configure(function(config) {
        config.resource = "user";
      });

      expect(Member.api().get("index", {})).toEqual("https://api.edmodo.com/users.xml");
    });

    it("is overridden by model-specific configuration", function() {
      API.configure(function(config) {
        config.baseURL      = "https://api.edmodo.com";
        config.format       = "text/xml";
        config.appendFormat = false;
      });

      function User() {}
      User.inherits(ngActiveResource.Base);

      expect(User.api().get("index", {})).toEqual("https://api.edmodo.com/users");
      expect(Post.api().get("index", {})).toEqual("https://api.edmodo.com/posts.json");
    });
  });
});
