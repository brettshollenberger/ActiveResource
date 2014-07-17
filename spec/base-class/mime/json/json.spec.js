describe("Mime.JSON", function() {
  describe("Adding Formats", function() {
    var json, post;
    beforeEach(function() { 
      post = Post.new({id: 1, title: "My Great Post"});
      json = JSON.stringify(post);
    });

    it("parses json", function() {
      expect(Mime.parse({type: "json", data: json})).toEqual({id: 1, title: "My Great Post"});
    });

    it("formats json", function() {
      expect(Mime.format({type: "json", data: post})).toEqual(
        '{"id":1,"title":"My Great Post"}');
    });

    it("adds toJSON method to base class instances", function() {
      expect(post.toJson()).toEqual('{"id":1,"title":"My Great Post"}');
    });
  });
});
