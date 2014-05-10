describe('BCCache', function() {
  it('adds a cache to the model', function() {
    expect(Post.cached).toEqual({});
  });

  it('adds new instances to the cache when they are created', function() {
    var post = Post.new({id: 1});
    expect(Post.cached[1]).toEqual(post);
  });

  it('is empty if it contains no instances', function() {
    expect(Post.cached.isEmpty()).toEqual(true);
  });

  it('is not empty if it contains instances', function() {
    var post = Post.new({id: 1});
    expect(Post.cached.isEmpty()).toEqual(false);
  });

  it('finds via search parameters', function() {
    var post = Post.new({id: 1});
    expect(Post.cached.where({id: 1})).toEqual([post]);
  });
});
