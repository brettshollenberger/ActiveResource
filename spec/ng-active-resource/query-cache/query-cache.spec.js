describe("ARQueryCache", function() {
  var queryCache;
  beforeEach(function() {
    queryCache = new QueryCache();

    backend.whenGET("https://api.edmodo.com/comments.json?post_id=1")
           .respond(200, [{id: 1}, {id: 2}]);

    backend.whenGET("https://api.edmodo.com/comments.json?post_id=1&author_id=1")
           .respond(200, [{id: 3}, {id: 4}]);

    backend.whenGET("https://api.edmodo.com/comments.json?post_id=2&author_id=2")
           .respond(200, [{id: 5}, {id: 6}]);

  });

  it("creates sorted query keys", function() {
    var key = queryCache.createCacheKey({published: true, author_id: 1});
    expect(key).toEqual(JSON.stringify({author_id: 1, published: true}));
  });

  it("caches query by key", function() {
    var cachedResult = [{id: 2}];
    queryCache.cache({published: true, author_id: 1}, cachedResult);
    expect(queryCache.find({author_id: 1, published: true})).toEqual(cachedResult);
  });

  describe("Updating Cached Queries", function() {
    describe("Saving new instances in the appropriate queries", function() {
      it("handles a simple example", function() {
        backend.whenPOST("https://api.edmodo.com/comments.json")
               .respond(200, {id: 3, post_id: 1});

        var comments = Comment.where({post_id: 1});

        backend.flush();

        expect(Comment.queryCache.find({post_id: 1})).toEqual(comments);

        var post    = Post.new({id: 1});
        var comment = Comment.$create({post_id: 1});

        backend.flush();

        expect(Comment.queryCache.find({post_id: 1})).toContain(comment);
      });

      it("handles a complex example", function() {
        backend.whenPOST("https://api.edmodo.com/comments.json")
               .respond(200, {id: 3, body: "fun!"});

        backend.whenPUT("https://api.edmodo.com/comments/3.json")
               .respond(200, {id: 3, body: "fun!"});

        var post   = Post.new({id: 1});
        var query1 = Comment.where({post_id: 1});
        var query2 = Comment.where({post_id: 1, author_id: 1});
        var query3 = Comment.where({post_id: 2, author_id: 2});

        backend.flush();

        var comment = Comment.$create({body: "fun!"});

        backend.flush();

        expect(Comment.queryCache.find({post_id: 1})).not.toContain(comment);
        expect(Comment.queryCache.find({post_id: 1, author_id: 1})).not.toContain(comment);
        expect(Comment.queryCache.find({post_id: 2, author_id: 2})).not.toContain(comment);

        comment.$update({post_id: 1, author_id: 1});
        backend.flush();

        expect(Comment.queryCache.find({post_id: 1})).toContain(comment);
        expect(Comment.queryCache.find({post_id: 1, author_id: 1})).toContain(comment);
        expect(Comment.queryCache.find({post_id: 2, author_id: 2})).not.toContain(comment);

        comment.post = undefined;
        comment.$update();

        backend.flush();

        expect(Comment.queryCache.find({post_id: 1})).not.toContain(comment);
        expect(Comment.queryCache.find({post_id: 1, author_id: 1})).not.toContain(comment);
        expect(Comment.queryCache.find({post_id: 2, author_id: 2})).not.toContain(comment);
      });
    });

    describe("Deleting instances removes them from all cached queries", function() {
      it("handles a simple example", function() {
        backend.whenDELETE("https://api.edmodo.com/comments/1.json")
               .respond(200, {});

        var comments = Comment.where({post_id: 1});

        backend.flush();

        var comment = comments.first();

        expect(Comment.queryCache.find({post_id: 1})).toContain(comment);

        comment.$delete();

        backend.flush();

        expect(Comment.queryCache.find({post_id: 1})).not.toContain(comment);
      });
    });
  });
});
