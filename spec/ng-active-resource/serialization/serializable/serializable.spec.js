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

    it("serializes instances", function() {
      post = Post.new({id: 1, title: "My Great Post", author_id: 2});

      expect(post.serialize())
        .toEqual('{"title":"My Great Post","id":1,"comments":[],"author":{"id":2}}');
    });

    it("allows serialization of empty string", function() {
      post = Post.new({id: 1, title: ""});
      expect(post.serialize()).toEqual('{"title":"","id":1,"comments":[]}');
    });

    it("allows serialization of nulls", function() {
      post = Post.new({id: 1, title: null});
      expect(post.serialize()).toEqual('{"title":null,"id":1,"comments":[]}');
    });

    it("translates associations to foreign keys", function() {
      post    = Post.new({id: 1});
      comment = post.comments.new();

      expect(comment.serialize())
        .toEqual('{"post_id":1}');
    });

    it("translates associations to non-normative foreign keys", function() {
      person = Person.new({id: 1});
      hat    = person.hats.new();

      expect(hat.serialize())
        .toEqual('{"user_id":1}');
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
      Post.api.configure(function(config) {
        config.format            = "xml";
        config.unwrapRootElement = true;
      });

      expect(Post.serialize(post)).toEqual(xml);
    });
  });
});

