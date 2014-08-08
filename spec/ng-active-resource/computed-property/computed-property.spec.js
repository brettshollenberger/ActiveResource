describe("Computed Properties", function() {
  var tshirt;
  beforeEach(function() {
    tshirt = TShirt.new({order_id: 1, price: 10.99, available: true, name: 'Ragin Shirt'});
  });

  it("computes properties based on other properties", function() {
    expect(tshirt.salePrice).toEqual(8.792);
  });

  it('computes the property during any change', function() {
    tshirt.price = '20.00';
    expect(tshirt.salePrice).toEqual(16);
  });

  it('creates complex chains of computed properties', function() {
    tshirt.price = '20.00';
    expect(tshirt.superSalePrice).toEqual(4);
  });

  it('creates complex chains of computed properties', function() {
    tshirt.price = '20.00';
    expect(tshirt.superDuperSalePrice).toEqual('-32 Wow! We owe YOU money!');
  });

  it('creates computed arrays', function() {
    tshirt.price = '20.00';
    expect(tshirt.allTheProperties).toEqual([ 'Ragin Shirt', true, '20.00', 1 ]);
  });

  it('creates computed objects', function() {
    tshirt.price = '20.00';
    expect(tshirt.prices).toEqual({ price : '20.00', salePrice : 16, superSalePrice : 4, superDuperSalePrice : '-32 Wow! We owe YOU money!' });
  });

  it("creates inter-dependent relationships without creating infinite set loops", function() {
    Order.inherits(ngActiveResource.Base);

    function Order() {
      this.computedProperty("price", function() {
        if (isNaN(this.salePrice)) { return 0; }
        return Number(this.salePrice) + 5;
      }, "salePrice");

      this.computedProperty("salePrice", function() {
        return Number(this.price) - 5;
      }, "price");
    }

    var order = Order.new();

    expect(order.price).toEqual(0);
    expect(order.salePrice).toEqual(-5);

    order.price = 10;

    expect(order.salePrice).toEqual(5);

    order.salePrice = 100;
    expect(order.price).toEqual(105);
  });
});
