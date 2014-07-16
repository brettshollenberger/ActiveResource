describe("Mime", function() {
  describe("Adding Formats", function() {
    beforeEach(function() {
      new Mime.Format({name: "json"});
    });

    it("adds new core formats", function() {
      expect(Mime.formats.json).toBeDefined();
    });
  });
});
