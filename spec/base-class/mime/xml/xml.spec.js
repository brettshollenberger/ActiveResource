describe("Mime.XML", function() {
  describe("Adding Formats", function() {
    var xml;
    beforeEach(function() { 
      xml = "<post> \
              <postId>1</postId> \
              <title>My Great Post</title> \
            </post>";

    });

    it("parses xml", function() {
      expect(Mime.parse({type: "xml", data: xml})).toEqual({
        post : { 
          postId : '1', 
          title : 'My Great Post' 
        }
      });
    });

    it("formats xml", function() {
      var javascriptObject = Mime.parse({type: "xml", data: xml});

      expect(Mime.format({type: "xml", data: javascriptObject})).toEqual(
        "<post><postId>1</postId><title>My Great Post</title></post>");
    });

    it("adds toXML method to base class instances", function() {
      var post = Post.new({id: 1, title: "My Great Post"});
      expect(post.toXML()).toEqual("<id>1</id><title>My Great Post</title><commentCount/><public/><$errors/>");
    });
  });
});
