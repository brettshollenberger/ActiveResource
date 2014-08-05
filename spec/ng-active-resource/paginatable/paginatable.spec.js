describe("ARPaginatable", function() {

  var posts;
  beforeEach(function() {
    backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&per_page=5")
           .respond(200, [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}],
             {'Link': 
              '<https://api.edmodo.com/posts.json?author_id=1&page=2&per_page=5>; rel="next", <https://api.edmodo.com/whatever>; rel="prev"'});

    backend.whenGET("https://api.edmodo.com/posts.json?author_id=1&page=2&per_page=5")
           .respond(200, [{id: 6}, {id: 7}, {id: 8}, {id: 9}, {id: 10}],
             {'Link': 
              '<https://api.edmodo.com/posts.json?author_id=1&page=1&per_page=5>; rel="previous"'});

    posts = Post.where({author_id: 1, per_page: 5});

    spyOn($http, "get").andCallThrough();
    backend.flush();

    posts.paginate({per_page: 2});
  });

  it("implements a list of pages", function() {
    expect(posts.__pages()[0].first().id).toEqual(1);
    expect(posts.__pages()[0].last().id).toEqual(2);
  });

  it("rehashes the list of pages", function() {
    posts.__per_page = 4;
    expect(posts.__pages()[0].first().id).toEqual(1);
    expect(posts.__pages()[0].last().id).toEqual(4);
  });

  it("returns the current page", function() {
    expect(posts.current_page().first().id).toEqual(1);
    expect(posts.current_page().last().id).toEqual(2);
  });

  it("moves to the next page on the client", function() {
    posts.next_page();

    expect(posts.current_page().first().id).toEqual(3);
    expect(posts.current_page().last().id).toEqual(4);
  });

  it("moves to the previous page on the client", function() {
    posts.next_page();
    posts.previous_page();

    expect(posts.current_page().first().id).toEqual(1);
    expect(posts.current_page().last().id).toEqual(2);
  });

  it("by default preloads the next page it doesn't have", function() {
    _.each(_.range(2), function() { posts.next_page(); });
    backend.flush();

    expect($http.get.mostRecentCall.args[0])
      .toEqual("https://api.edmodo.com/posts.json");

    expect($http.get.mostRecentCall.args[1].params)
      .toEqual({ author_id : 1, page : 2, per_page : 5 });
  });

  it("loads in the next page worth of data internally", function() {
    posts.next_page();
    backend.flush();
    posts.next_page();

    expect(posts.current_page().first().id).toEqual(5);
    expect(posts.current_page().last().id).toEqual(6);

    posts.next_page();

    expect(posts.current_page().first().id).toEqual(7);
    expect(posts.current_page().last().id).toEqual(8);
  });
});
