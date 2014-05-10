describe('ARBase', function() {
  describe('Model#new', function() {
    var post;
    beforeEach(function() {
      post = Post.new({title: 'My Great Post'});
    });

    it('creates a new instance', function() {
      expect(post.constructor.name).toBe('Post');
    });

    it('instantiates using attributes passed in', function() {
      expect(post.title).toBe('My Great Post');
    });
  });
});
