describe("Parsing", function() {
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

      backend.whenGET("https://api.edmodo.com/posts/1.json")
        .respond(response);

      spyOn($http, 'get').andCallThrough();
    });

    it("deserializes instances using parse method", function() {
      expect(Post.deserialize(response).author_id).toEqual(2);
    });

    it("deserializes arrays of instances using parse method", function() {
      Post.api().configure(function(config) {
        config.format            = "xml";
        config.unwrapRootElement = true;
      });

      expect(Post.deserialize(xml).author_id).toEqual(2);
    });

    it("passes to model-specific parse function after parsing the mimetype", function() {
      Post.find(1).then(function(response) { post = response; });
      backend.flush();
      expect(post.author_id).toEqual(2);
    });
  });
});

