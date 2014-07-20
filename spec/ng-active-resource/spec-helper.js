var ngActiveResource, Mocks, Post, Comment, Person, Hat, Collection, TShirt, API, backend, $http, $timeout, QueryCache;
beforeEach(module('ngActiveResource'));
beforeEach(module('Mocks'));
beforeEach(inject(function(_ngActiveResource_, _Mocks_, _ARMime_, _ARAPI_, $httpBackend, _$http_, 
  _ARQueryCache_, _$timeout_) {
    ngActiveResource = _ngActiveResource_;
    Mocks            = _Mocks_;
    Post             = Mocks.Post;
    Comment          = Mocks.Comment;
    Person           = Mocks.Person;
    Hat              = Mocks.Hat;
    Collection       = Mocks.Collection;
    TShirt           = Mocks.TShirt;
    Mime             = _ARMime_;
    API              = _ARAPI_;
    backend          = $httpBackend;
    $http            = _$http_;
    $timeout         = _$timeout_;
    QueryCache       = _ARQueryCache_;

    API.configure(function(config) {
      config.baseURL = "https://api.edmodo.com";
    });
}));
