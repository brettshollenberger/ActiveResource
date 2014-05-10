describe('ngActiveResource', function() {

  describe('Inheritance', function() {
    var post;
    beforeEach(function() {
      function BaseClass() {
        var _constructor = this;
        var _prototype   = _constructor.prototype;

        _constructor.new = function(attributes) {
          if (!attributes) attributes = {};
          return new _constructor(attributes);
        };
        _prototype.$save = angular.noop;
      };

      Post.inherits(BaseClass);
      post = Post.new();
    });

    it('adds Constructor functionality', function() {
      expect(Post.new).toBeDefined();
    });

    it('adds Constructor.prototype functionality', function() {
      expect(post.$save).toBeDefined();
    });
  });


});
