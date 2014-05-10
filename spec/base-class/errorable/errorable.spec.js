describe("BCErrorable", function() {
  var person;
  beforeEach(function() {
    person = Person.new({
      name: "Troy Barnes",
      age: 25,
      email: "troy@greendale.edu"
    });
  });

  it("adds errors", function() {
    person.$errors.add("name", "is too short.");
    expect(person.$errors.name).toContain("is too short.");
  });

  it("adds errors idempotently", function() {
    person.$errors.add("name", "is too short.");
    person.$errors.add("name", "is too short.");
    expect(person.$errors.name.length).toEqual(1);
  });

  it("clears errors", function() {
    person.$errors.add("name", "is too short.");
    person.$errors.clear();
    expect(person.$errors.count).toEqual(0);
  });

  it("clears errors on individual fields", function() {
    person.$errors.add("name", "is too short.");
    person.$errors.add("age", "is too young.");
    person.$errors.clear("name");
    expect(person.$errors.count).toEqual(1);
  });

  it("clears an array of field names", function() {
    person.$errors.add("name", "is too short.");
    person.$errors.add("age", "is too young.");
    person.$errors.add("email", "is incorrectly formatted");
    person.$errors.clear(["name", "age"]);
    expect(person.$errors.count).toEqual(1);
  });

  it("clears particular error messages", function() {
    person.$errors.add("name", "is too short.");
    person.$errors.add("name", "is too weird.");
    person.$errors.clear("name", "is too weird.");
    expect(person.$errors.count).toEqual(1);
  });

  it("clears all error messages of a type when there are none", function() {
    person.$errors.add("name", "is too short.");
    person.$errors.add("name", "is too weird.");
    person.$errors.clear("name", "is too weird.");
    person.$errors.clear("name", "is too short.");
    expect(person.$errors.name).toBeUndefined();
  });
});
