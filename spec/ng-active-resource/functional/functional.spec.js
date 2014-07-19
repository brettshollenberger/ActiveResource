describe("Functional", function() {
  var post, comment1, comment2;
  beforeEach(function() {
    post     = Post.new({id: 1, title: "Great post!"});
    comment1 = post.comments.new({id: 1, body: "Great comment!"});
    comment2 = post.comments.new({id: 2, body: "Good comment :("});
  });

  it("finds the first in the collection", function() {
    expect(post.comments.first()).toEqual(comment1);
  });

  it("finds the last in the collection", function() {
    expect(post.comments.last()).toEqual(comment2);
  });

  it("counts number matching a block", function() {
    expect(post.comments.count(function(comment) { return comment.id == 1; })).toEqual(1);
    expect(post.comments.count(function(comment) { return _.include(comment.body, "comment"); })).toEqual(2);
  });

  it("plucks", function() {
    expect(post.comments.pluck("id")).toEqual([1, 2]);
  });

  it("maps", function() {
    expect(post.comments.map(function(comment) { return comment.id; })).toEqual([1, 2]);
  });

  it("filters", function() {
    expect(post.comments.filter(function(comment) { return _.include(comment.body, "Great"); })).toEqual([comment1]);
    expect(post.comments.include(comment2)).toBe(true);
  });

  it("chains", function() {
    expect(post.comments.filter(function(comment) { return comment.id == 1; }).pluck("id").first()).toEqual(1);
  });

  it("rejects", function() {
    expect(post.comments.reject(function(comment) { return _.include(comment.body, "Great"); })).toEqual([comment2]);
    expect(post.comments.include(comment1)).toBe(true);
  });

  it("contains", function() {
    expect(post.comments.contains(comment2)).toBe(true);
  });

  it("injects", function() {
    expect(post.comments.inject(function(sum, comment) { 
      if (comment.id > 1) { sum += 1; }
      return sum;
    }, 0)).toEqual(1);
  });

  it("maxes", function() {
    expect(post.comments.max("id")).toEqual(comment2);
  });

  it("mins", function() {
    expect(post.comments.min(function(comment) { return comment.id; })).toEqual(comment1);
  });

  it("sorts", function() {
    expect(post.comments.sortBy(function(comment) { return -comment.id; })).toEqual([comment2, comment1]);
  });

  it("knows if all match a block", function() {
    expect(post.comments.all(function(comment) { return _.include(comment.body, "comment"); })).toEqual(true);
    expect(post.comments.all(function(comment) { return comment.id == 1; })).toEqual(false);
  });

  it("knows if any matches a block", function() {
    expect(post.comments.any(function(comment) { return comment.id == 1; })).toEqual(true);
    expect(post.comments.any(function(comment) { return comment.id == 3; })).toEqual(false);
  });

  it("knows if it is empty", function() {
    expect(post.comments.empty()).toEqual(false);
    post.comments.pop() && post.comments.pop();
    expect(post.comments.empty()).toEqual(true);
  });
});
