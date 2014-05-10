describe('ARCache', function() {
  it('creates a cache for the model', function() {
    expect(Post.cached).toEqual({});
  });

  it('caches instances', function() {
    var post = Post.new({id: 1});
    expect(Post.cached[1]).toEqual(post);
  });

  it('isEmpty if it contains no instance', function() {
    expect(Post.cached.isEmpty()).toBe(true);
  });

  it('is not empty if it contains at least one instance', function() {
    var post = Post.new({id: 1});
    expect(Post.cached.isEmpty()).toBe(false);
  });

  it('finds via search parameters', function() {
    var post = Post.new({id: 1});
    expect(Post.cached.where({id: 1})).toEqual([post]);
  });

  it('cannot add new instances to the cache if they use the `new Constructor()` syntax', function() {
    var post = new Post({id: 2});
    expect(Post.cached[2]).toBe(undefined);
  });

  it('does not add instances to the cache if they do not have primary keys', function() {
    var post      = Post.new();
    var assertion = _.include(Post.cached, post); 
    expect(assertion).toBe(false);
  });
});
