var ngActiveResource, Mocks, Player, Ship, Post, Author, Comment, Person, Hat, Collection, TShirt, Member, District, School, API, backend, $http, $timeout, Delegatable, mixin, Reflections, foreignkeyify, dropHasMany, serializeAssociations, params, $location, $route;

beforeEach(module('ngRoute'));

beforeEach(function() {
  angular.module('ngRoute').config(function($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "views/members/index.html",
        controller: "MembersIndexCtrl"
      })
      .when("/districts/:district_id/members/", {
        templateUrl: "views/members/index.html",
        controller: "MembersIndexCtrl"
      })
      .when("/schools/:school_id/members/", {
        templateUrl: "views/members/index.html",
        controller: "MembersIndexCtrl"
      })
      .when("/posts", {
        templateUrl: "views/posts/index.html",
        controller: "PostsIndexCtrl"
      });
  });
});

beforeEach(module('ngActiveResource'));
beforeEach(module('Mocks'));
beforeEach(inject(function(_ngActiveResource_, _Mocks_, _ARMime_, _ARAPI_, $httpBackend, _$http_, 
  _$timeout_, _ARDelegatable_, _ARMixin_, _ARReflections_, _Foreignkeyify_, _DropHasMany_,
  _ARSerializeAssociations_, _ARParams_, _$location_, _$route_) {
    ngActiveResource      = _ngActiveResource_;
    Mocks                 = _Mocks_;
    Player                = Mocks.Player;
    Ship                  = Mocks.Ship;
    Post                  = Mocks.Post;
    Author                = Mocks.Author;
    Comment               = Mocks.Comment;
    Person                = Mocks.Person;
    Hat                   = Mocks.Hat;
    Collection            = Mocks.Collection;
    TShirt                = Mocks.TShirt;
    Member                = Mocks.Member;
    District              = Mocks.District;
    School                = Mocks.School;
    Mime                  = _ARMime_;
    API                   = _ARAPI_;
    backend               = $httpBackend;
    $http                 = _$http_;
    $timeout              = _$timeout_;
    Delegatable           = _ARDelegatable_;
    mixin                 = _ARMixin_;
    Reflections           = _ARReflections_;
    foreignkeyify         = _Foreignkeyify_;
    dropHasMany           = _DropHasMany_;
    serializeAssociations = _ARSerializeAssociations_;
    params                = _ARParams_;
    $location             = _$location_;
    $route                = _$route_;

    API.configure(function(config) {
      config.baseURL = "https://api.edmodo.com";
    });

    backend.whenGET("views/members/index.html").respond("");
    backend.whenGET("views/posts/index.html").respond("");

}));
