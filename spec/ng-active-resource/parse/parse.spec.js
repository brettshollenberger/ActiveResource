describe("Parsing", function() {
  describe("Adding model-specific parse methods", function() {
    it("passes to model-specific parse function after parsing the mimetype", function() {
      var post;

      function Post() {
        this.integer("id");
        this.string("title");
        this.integer("author_id");
      }

      Post.inherits(ngActiveResource.Base);

      Post.parse = function(post) {
        if (post.author) {
          post.author_id = post.author.id;
          delete post.author;
        }

        return post;
      }

      Post.api().configure(function(config) {
        config.baseURL           = "https://api.edmodo.com";
        config.format            = "xml";
        config.unwrapRootElement = true;
      });

      backend.whenGET("https://api.edmodo.com/posts/1.xml")
        .respond("<post><id>1</id><title>My Great Post</title><author><id>2</id></author></post>");

      spyOn($http, 'get').andCallThrough();

      Post.find(1).then(function(response) { 
        post = response; 
      });

      backend.flush();

      expect(post.author_id).toEqual('2');
    });
  });
});

