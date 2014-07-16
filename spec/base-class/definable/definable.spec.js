describe("BCDefinable", function() {
  describe("Standard Properties", function() {
    var post;
    beforeEach(function() {
      post = Post.new({id: 1, title: "What I Want", commentCount: 5, public: true});
    });

    it("adds integer attributes", function() {
      expect(post.id).toEqual(1);
    });

    it("adds integer validations", function() {
      expect(post.$valid).toEqual(true);
      post.id = "fun";
      expect(post.$valid).toEqual(false);
    });

    it("adds string attributes", function() {
      expect(post.title).toEqual("What I Want");
    });

    it("adds number properties", function() {
      expect(post.commentCount).toEqual(5);
    });

    it("adds number validations", function() {
      expect(post.$valid).toEqual(true);
      post.commentCount = "low";
      expect(post.$valid).toEqual(false);
    });

    it("adds boolean properties", function() {
      expect(post.public).toEqual(true);
    });

    it("adds boolean validations", function() {
      expect(post.$valid).toEqual(true);
      post.public = "maybe";
      expect(post.$valid).toEqual(false);
    });
  });

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
  });
});
