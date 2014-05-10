var Mocks, ActiveResource, Post;
beforeEach(module('ActiveResource'));
beforeEach(module('Mocks'));
beforeEach(inject(function(_ActiveResource_, _Mocks_) {
  ActiveResource = _ActiveResource_;
  Mocks          = _Mocks_;
  Post           = Mocks.Post;
}));
