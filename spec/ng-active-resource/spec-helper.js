var Mocks, ngActiveResource, Post, Person, TShirt;
beforeEach(module('ngActiveResource'));
beforeEach(module('Mocks'));
beforeEach(inject(function(_ngActiveResource_, _Mocks_, _ARMime_) {
  ngActiveResource = _ngActiveResource_;
  Mocks            = _Mocks_;
  Post             = Mocks.Post;
  Person           = Mocks.Person;
  TShirt           = Mocks.TShirt;
  Mime             = _ARMime_;
}));
