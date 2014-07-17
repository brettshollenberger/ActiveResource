describe('ARAPI', function() {
  describe("api#set", function() {
    it("sets the base URL", function() {
      expect(Post.api().baseURL).toEqual("https://api.edmodo.com");
    });

    it("drops trailing slashes from baseURL if necessary", function() {
      Post.api().set("https://api.edmodo.com/");
      expect(Post.api().baseURL).toEqual("https://api.edmodo.com");
    });

    it("sets http protocol if necessary", function() {
      Post.api().set("api.edmodo.com");
      expect(Post.api().baseURL).toEqual("http://api.edmodo.com");
    });

    it("adds an index URL", function() {
      expect(Post.api().indexURL).toEqual("/posts");
    });

    it("adds a show URL", function() {
      expect(Post.api().showURL).toEqual("/posts/:id");
    });

    it("adds a create URL", function() {
      expect(Post.api().createURL).toEqual("/posts");
    });

    it("adds an update URL", function() {
      expect(Post.api().updateURL).toEqual("/posts/:id");
    });

    it("adds a delete URL", function() {
      expect(Post.api().deleteURL).toEqual("/posts/:id");
    });
  });

  describe("api#get", function() {
    it("parameterizes params that exist on instances", function() {
      expect(Post.api().get("show", {id: 1})).toEqual("https://api.edmodo.com/posts/1");
    });

    it("appends a query string with the rest of the parameters for GET type URLs", function() {
      expect(Post.api().get("show", {id: 1, author_id: 1, public: true})).toEqual(
        "https://api.edmodo.com/posts/1?author_id=1&public=true");

      expect(Post.api().get("index", {author_id: 1, public: true}))
        .toEqual("https://api.edmodo.com/posts?author_id=1&public=true");
    });

    it("only parameterizes params for delete action", function() {
      expect(Post.api().get("delete", {id: 1, public: true}))
        .toEqual("https://api.edmodo.com/posts/1");
    });

    it("only parameterizes params for update action", function() {
      expect(Post.api().get("update", {id: 1, public: true}))
        .toEqual("https://api.edmodo.com/posts/1");
    });

    it("appends no query string for create action", function() {
      expect(Post.api().get("create", {id: 1, public: true}))
        .toEqual("https://api.edmodo.com/posts");
    });
  });
});
