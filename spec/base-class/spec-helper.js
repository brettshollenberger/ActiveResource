var Mocks, BaseClass, Post, Person;
beforeEach(module('BaseClass'));
beforeEach(module('Mocks'));
beforeEach(inject(function(_BaseClass_, _Mocks_, _BCMime_) {
  BaseClass = _BaseClass_;
  Mocks     = _Mocks_;
  Post      = Mocks.Post;
  Person    = Mocks.Person;
  Mime      = _BCMime_;
}));
