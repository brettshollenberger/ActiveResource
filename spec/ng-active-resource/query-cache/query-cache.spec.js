describe("ARQueryCache", function() {
  var queryCache;
  beforeEach(function() {
    queryCache = new QueryCache();
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
});
