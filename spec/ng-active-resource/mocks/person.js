angular
  .module('Mocks')
  .factory('Person', ['ngActiveResource', function(ngActiveResource) {

    Person.inherits(ngActiveResource.Base);

    function Person(attributes) {
      this.name                 = attributes.name;
      this.age                  = attributes.age;
      this.email                = attributes.email;
      this.username             = attributes.username;
      this.zip                  = attributes.zip;
      this.uuid                 = attributes.uuid;
      this.terms                = attributes.terms;
      this.size                 = attributes.size;
      this.password             = attributes.password;
      this.passwordConfirmation = attributes.passwordConfirmation;
    }

    Person.hasMany("hats", {provider: "ARHat"});

    return Person;
  }]);
