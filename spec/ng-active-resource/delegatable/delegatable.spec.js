
describe('Delegatable', function() {

  var account, client, address;
  beforeEach(function() {

    Account.include(Delegatable);

    function Account(options) {
      this.lead   = options.lead;
      this.client = options.client;

      this.delegate("address").to(this.client);
      this.delegate("street").to(this.client);
    }

    Client.include(Delegatable);

    function Client(options) {
      this.address = options.address;

      this.delegate("street").to(this.address);
    }

    function Address(address) {
      this.street = function() {
        return address.split("\n")[0];
      }
    }

    address = new Address("123 Green Street\nSan Francisco, CA 94110");
    client  = new Client({address: address});
    account = new Account({lead: "Jerry", client: client});
  });

  it("delegates method calls to the associated object", function() {
    expect(client.street()).toEqual(address.street());
  });

  it("creates accessor methods when necessary", function() {
    expect(account.address()).toEqual(client.address);
  });

  it("creates chains", function() {
    expect(account.street()).toEqual(client.street());
    expect(client.street()).toEqual(address.street());
  });

  it("delegates to arbitrary objects", function() {
    var a = {};
    var b = {c: function() { return this; }}
    a.b   = b;

    a.extend(Delegatable);
    a.delegate("c").to(b);

    expect(a.c()).toEqual(b);
  });
});

