describe("Mime.XML", function() {
  describe("Adding Formats", function() {
    it("parses xml", function() {
      var xml = "<post> \
                  <postId>1</postId> \
                  <title>My Great Post</title> \
                </post>";

      expect(Mime.parse({type: "xml", data: xml})).toEqual({
        post : { 
          postId : '1', 
          title : 'My Great Post' 
        }
      });
    });
  });
});
