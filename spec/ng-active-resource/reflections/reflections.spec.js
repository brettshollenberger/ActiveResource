describe("ARReflection", function() {

  var Farm;
  beforeEach(function() {
    Farm = function Farm() {}
    Farm.include(Reflections);
  });

  it("creates hasMany reflections", function() {
    Farm.hasMany("pigs", {});
    expect(Farm.reflections.pigs.constructor.name).toEqual("HasManyReflection");
  });

  it("creates belongsTo reflections", function() {
    Farm.belongsTo("farmer", {});
    expect(Farm.reflections.farmer.constructor.name).toEqual("BelongsToReflection");
  });

});
