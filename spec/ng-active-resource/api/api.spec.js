describe('ARAPI', function() {
  describe("api#set", function() {
    it("sets the base URL", function() {
      expect(Post.api().baseURL).toEqual("https://api.edmodo.com");
    });

    it("drops trailing slashses from baseURL if necessary", function() {
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
});
