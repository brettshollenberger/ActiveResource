describe("AREventable", function() {
  describe("Evented Models", function() {
    var person, instance, attributes;
    beforeEach(function() {
      person = Person.new({
        name: "Troy Barnes",
             age: 25,
             email: "troy@greendale.edu"
      });

      Person.before("save", function(i, a) {
        instance   = i;
        attributes = a;
      });

      backend.whenPOST("https://api.edmodo.com/people.json")
      .respond(200, {id: 1, name: "Troy Barnes", age: 25, email: "troy@greendale.edu"});
    });

    it("passes the instance and attributes on save", function() {
      person.$save({fun: true});
      backend.flush();

      expect(instance).toEqual(person);
      expect(attributes).toEqual({fun: true});
    });
  });

  describe("Evented Instances", function() {
    var post, posts;
    beforeEach(function() {
      backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=1")
             .respond(200, [{id: 2, author_id: 1}]);

      posts = Post.where({author_id: 1});
      backend.flush();

      post = Post.new({});

      post.after("save", function() {
        posts.push(post);
      });
    });

    iit("features an interface for adding events to instances", function() {
      expect(posts).toInclude(post);
    });
  });
});
