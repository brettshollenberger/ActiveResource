describe("ARDeletable", function() {
  describe("Deleting instances", function() {
    var post;
    beforeEach(function() {
      backend.whenDELETE("https://api.edmodo.com/posts/1.json").respond(200, {});

      spyOn($http, "delete").andCallThrough();

      post         = Post.new({id: 1});
      post.$delete({title: "My Great Title"});

      backend.flush();
    });

    it("calls the deleteURL", function() {
      expect($http.delete.mostRecentCall.args[0]).toEqual("https://api.edmodo.com/posts/1.json");
    });
  });
});
