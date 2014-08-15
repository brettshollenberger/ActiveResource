describe("ARParams", function() {
  it("removes empty params", function() {
    expect(params.standardize({author_id: 1, query: ""})).toEqual({author_id: 1});
  });
});
