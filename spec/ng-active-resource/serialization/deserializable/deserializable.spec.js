describe("Deserializable", function() {
  describe("Adding model-specific parse methods", function() {

    var post, xml, response;
    beforeEach(function() {
      response = JSON.stringify({ id: 1, title: "My Great Post", author: { id: 2 } })
      xml      = "<post>" +
                    "<id>1</id>" +
                    "<title>My Great Post</title>" +
                    "<author>" +
                      "<id>2</id>" + 
                    "</author>" +
                "</post>";
    });

    it("deserializes instances using parse method", function() {
      expect(Post.deserialize(response).author_id).toEqual(2);
    });

    it("deserializes arrays of instances using parse method", function() {
      var posts = JSON.stringify([
        {
          id: 1,
          title: "My Great Post",
          author: {
            id: 2
          }
        },
        {
          id: 3,
          title: "My Greater Post",
          author: {
            id: 4
          }
        }
      ]);
      expect(Post.deserialize(posts)[0].author_id).toEqual(2);
    });

    it("deserializes empty strings", function() {
      expect(Post.deserialize("")).toEqual({});
    });

    it("deserializes xml", function() {
      Post.api.configure(function(config) {
        config.format            = "xml";
        config.unwrapRootElement = true;
      });

      expect(Post.deserialize(xml).author_id).toEqual(2);
    });
  });
});

