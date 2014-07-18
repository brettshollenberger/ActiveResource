describe("Serializable", function() {
  describe("Adding model-specific format methods", function() {

    var post, xml;
    beforeEach(function() {
      post = { id: 1, title: "My Great Post", author_id: 2 };
      xml  = "<id>1</id>" +
              "<title>My Great Post</title>" +
              "<author>" +
                "<id>2</id>" + 
              "</author>";
    });

    it("serializes instances using format method", function() {
      expect(Post.serialize(post))
        .toEqual('{"id":1,"title":"My Great Post","author":{"id":2}}');
    });

    it("serializes arrays of instances using format method", function() {
      var posts = [
        {
          id: 1,
          title: "My Great Post",
          author_id: 2
        },
        {
          id: 3,
          title: "My Greater Post",
          author_id: 4
        }
      ]
      expect(Post.serialize(posts)).toEqual(
        '[{"id":1,"title":"My Great Post","author":{"id":2}},{"id":3,"title":"My Greater Post","author":{"id":4}}]');
    });

    it("serializes xml", function() {
      Post.api().configure(function(config) {
        config.format            = "xml";
        config.unwrapRootElement = true;
      });

      expect(Post.serialize(post)).toEqual(xml);
    });
  });
});

