describe("AREventable", function() {
  var person, instance, attributes;
  beforeEach(function() {
    person = Person.new({
      name: "Troy Barnes",
      age: 25,
      email: "troy@greendale.edu"
    });

    Person.before("save", function(i, a) {
      instance   = i;
      attributes = a;
    });

    backend.whenPOST("https://api.edmodo.com/people.json")
           .respond(200, {id: 1, name: "Troy Barnes", age: 25, email: "troy@greendale.edu"});
  });

  it("passes the instance and attributes on save", function() {
    person.$save({fun: true});
    backend.flush();

    expect(instance).toEqual(person);
    expect(attributes).toEqual({fun: true});
  });
});
