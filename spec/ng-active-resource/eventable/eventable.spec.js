xdescribe("AREventable", function() {
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

      backend.whenPOST("https://api.edmodo.com/posts.json")
             .respond(200, {id: 3});

      posts = Post.where({author_id: 1});
      backend.flush();

      post = Post.new({});

      post.after("save", function() {
        posts.push(post);
      });

      post.$save();
      backend.flush();
    });

    it("features an interface for adding events to instances", function() {
      expect(posts).toContain(post);
    });
  });

  describe("Unbinding and Rebinding Events", function() {
    var post, posts;
    beforeEach(function() {
      backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=1")
             .respond(200, [{id: 2, author_id: 1}]);

      backend.whenPOST("https://api.edmodo.com/posts.json")
             .respond(200, {id: 3});

      backend.whenPUT("https://api.edmodo.com/posts/3.json")
             .respond(200, {id: 3});

      backend.whenPUT("https://api.edmodo.com/posts/4.json")
             .respond(200, {id: 4});

      backend.whenPUT("https://api.edmodo.com/posts/5.json")
             .respond(200, {id: 5});

      posts = Post.where({author_id: 1});
      backend.flush();

      post = Post.new({});
    });

    it("unbinds events, so that they do not run again", function() {
      var runCounter = 0;

      post.after("save", function() {
        runCounter++;
        posts.push(post);
        this.unbind();
      });

      post.$save();
      backend.flush();

      expect(runCounter).toEqual(1);
      expect(posts.length).toEqual(2);

      post.$save();
      backend.flush();

      expect(runCounter).toEqual(1);
      expect(posts.length).toEqual(2);
    });

    it("rebinds events, so that they run attched to another object", function() {
      var runCounter = 0;

      post.after("save", function() {
        runCounter++;
        posts.push(post);
        post = Post.new();
        this.rebindTo(post);
      });

      post.$save();
      backend.flush();

      expect(runCounter).toEqual(1);
      expect(posts.length).toEqual(2);

      post.$save({id: 4});
      backend.flush();

      expect(runCounter).toEqual(2);
      expect(posts.length).toEqual(3);

      post.$save({id: 5});
      backend.flush();

      expect(runCounter).toEqual(3);
      expect(posts.length).toEqual(4);
    });
  });
});
