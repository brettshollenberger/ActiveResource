ddescribe('ARValidations', function() {

  var Mocks, Post, post;
  beforeEach(inject(function(_Mocks_) {
    Mocks = _Mocks_;
    Post  = Mocks.Post;
    post = Post.new({title: 'Great Post'});
  }));

  describe('Built-in Validations', function() {
    describe('Required validator', function() {
      it('is invalid if not defined', function() {
        post.title = undefined;
        expect(post.$valid).toBe(false);
      });
    });
  });
});
