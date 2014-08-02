describe('ARConfigurable', function() {

  var configurableObject;
  beforeEach(function() {
    configurableObject = {
      fun: true,
      $http: {
        cache: true,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      }
    }

    configurableObject.extend(ngActiveResource.Configurable);
  });

  it("configures new properties while leaving old ones untouched", function() {
    configurableObject.$http = {
      data: {id: 1}
    }

    expect(configurableObject.$http.cache).toEqual(true);
    expect(configurableObject.$http.headers["Content-Type"]).toEqual("application/json");
  });

  it("ensures deep configurability", function() {
    configurableObject.$http = {
      cache: false,
      headers: {
        "Accept": "text/xml"
      }
    }

    expect(configurableObject.$http.cache).toEqual(false);
    expect(configurableObject.$http.headers["Content-Type"]).toEqual("application/json");
  });
});
