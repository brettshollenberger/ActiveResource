var Mocks, ngActiveResource, Post, Person, TShirt, API;
beforeEach(module('ngActiveResource'));
beforeEach(module('Mocks'));
beforeEach(inject(function(_ngActiveResource_, _Mocks_, _ARMime_, _ARAPI_) {
  ngActiveResource = _ngActiveResource_;
  Mocks            = _Mocks_;
  Post             = Mocks.Post;
  Person           = Mocks.Person;
  TShirt           = Mocks.TShirt;
  Mime             = _ARMime_;
  API              = _ARAPI_;
}));
