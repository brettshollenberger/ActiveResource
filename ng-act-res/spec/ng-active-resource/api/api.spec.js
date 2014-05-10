describe('ARAPI', function() {

  var Mime;
  beforeEach(inject(function(_ARMime_) {
    Mime = _ARMime_;
  }));

  describe('Base.api#set', function() {
    it('creates a show url', function() {
      expect(Post.api.showURL).toEqual('http://api.faculty.com/posts/:id');
    });

    it('creates a create url', function() {
      expect(Post.api.createURL).toEqual('http://api.faculty.com/posts');
    });

    it('creates a delete url', function() {
      expect(Post.api.deleteURL).toEqual('http://api.faculty.com/posts/:id');
    });

    it('creates an index url', function() {
      expect(Post.api.indexURL).toEqual('http://api.faculty.com/posts');
    });

    it('creates an update url', function() {
      expect(Post.api.updateURL).toEqual('http://api.faculty.com/posts/:id');
    });
  });

  describe('Base.api Overriding Individual URLs', function() {
    beforeEach(function() {
      Post.api.showURL   = 'http://api.faculty.com/find/posts';
      Post.api.createURL = 'http://api.faculty.com/create/posts';
      Post.api.deleteURL = 'http://api.faculty.com/delete/posts';
      Post.api.indexURL  = 'http://api.faculty.com/index/posts';
      Post.api.updateURL = 'http://api.faculty.com/update/posts';
    });

    it('sets show individually', function() {
      expect(Post.api.showURL).toBe('http://api.faculty.com/find/posts');
    });
      
    it('sets create individually', function() {
      expect(Post.api.createURL).toBe('http://api.faculty.com/create/posts');
    });

    it('sets delete individually', function() {
      expect(Post.api.deleteURL).toBe('http://api.faculty.com/delete/posts');
    });
    
    it('sets index individually', function() {
      expect(Post.api.indexURL).toBe('http://api.faculty.com/index/posts');
    });

    it('sets update individually', function() {
      expect(Post.api.updateURL).toBe('http://api.faculty.com/update/posts');
    });
  });

  describe('API Format', function() {

    beforeEach(function() {
      Post.api.format('json');
    });

    it('sets showURL with the format', function() {
      expect(Post.api.showURL).toBe('http://api.faculty.com/posts/:id.json');
    });

    it('sets createURL with the format', function() {
      expect(Post.api.createURL).toBe('http://api.faculty.com/posts.json');
    });

    it('sets indexURL with the format', function() {
      expect(Post.api.indexURL).toBe('http://api.faculty.com/posts.json');
    });

    it('sets deleteURL with the format', function() {
      expect(Post.api.deleteURL).toBe('http://api.faculty.com/posts/:id.json');
    });

    it('sets updateURL with the format', function() {
      expect(Post.api.updateURL).toBe('http://api.faculty.com/posts/:id.json');
    });

    it('formats properly when the extension is reset', function() {
      Post.api.format('xml');
      expect(Post.api.showURL).toBe('http://api.faculty.com/posts/:id.xml');
    });

    it('automatically adds custom Mimetypes when set', function() {
      Post.api.format('xml');
      expect(Mime.types).toContain('xml');
    });

    it('adds custom mimetypes', function() {
      Mime.types.register('proprietary');
      Post.api.format('proprietary');
      expect(Post.api.showURL).toBe('http://api.faculty.com/posts/:id.proprietary');
    });
  });
});
