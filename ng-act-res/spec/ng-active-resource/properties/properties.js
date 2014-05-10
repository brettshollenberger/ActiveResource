xdescribe('ActiveResource', function() {
  describe('Adding Properties', function() {

    var post;
    beforeEach(function() {
      post = Post.new({title: 'Great Post!'});
    });

    describe('Integer property type', function() {
      it('is valid if the property is an integer', function() {
        expect(post.$valid).toBe(true);
      });

      it('is invalid if the value is a float', function() {
        post.order_id = 1.5;
        expect(post.$valid).toBe(false);
      });

      it('is invalid if the value is a string', function() {
        post.order_id = 'NaN';
        expect(post.$valid).toBe(false);
      });

      it('is invalid if the value is an array', function() {
        post.order_id = ['value'];
        expect(post.$valid).toBe(false);
      });

      it('is invalid if the value is an object', function() {
        post.order_id = Post.new();
        expect(post.$valid).toBe(false);
      });

      it('is valid if it contains commas', function() {
        post.order_id = '1,111';
        expect(post.$valid).toBe(true);
      });
    });

    describe('Number property type', function() {
      it('is valid if the property is an integer', function() {
        post.price = '10';
        expect(post.$valid).toBe(true);
      });

      it('is valid if the value is a float', function() {
        expect(post.$valid).toBe(true);
      });

      it('is invalid if the value is a string', function() {
        post.price = 'NaN';
        expect(post.$valid).toBe(false);
      });

      it('is invalid if the value is an array', function() {
        post.price = ['value'];
        expect(post.$valid).toBe(false);
      });

      it('is invalid if the value is an object', function() {
        post.price = Post.new();
        expect(post.$valid).toBe(false);
      });

      it('is valid if it contains commas', function() {
        post.price = '1,111';
        expect(post.$valid).toBe(true);
      });
    });

    describe('Boolean property type', function() {
      it('is valid if true', function() {
        expect(post.$valid).toBe(true);
      });

      it('is valid if false', function() {
        post.available = 'false';
        expect(post.$valid).toBe(true);
      });

      it('is invalid if the value is a string', function() {
        post.available = 'NaN';
        expect(post.$valid).toBe(false);
      });

      it('is invalid if the value is a number', function() {
        post.available = 1;
        expect(post.$valid).toBe(false);
      });

      it('is invalid if the value is an object', function() {
        post.available = Post.new();
        expect(post.$valid).toBe(false);
      });
    });

    describe('String property type', function() {
      it('is valid if parseable to string', function() {
        expect(post.$valid).toBe(true);
      });

      it('is valid if parseable to string', function() {
        post.name = 5;
        expect(post.$valid).toBe(true);
      });

      it('is invalid if array', function() {
        post.name = [1, 2, 3]
        expect(post.$valid).toBe(false);
      });

      it('is invalid if object', function() {
        post.name = {};
        expect(post.$valid).toBe(false);
      });
    });

    describe('Computed Properties', function() {
      it('computes properties based on other properties', function() {
        expect(post.salePrice).toEqual(8.792);
      });

      it('computes the property during any change', function() {
        post.price = '20.00';
        expect(post.salePrice).toEqual(16);
      });

      it('creates complex chains of computed properties', function() {
        post.price = '20.00';
        expect(post.superSalePrice).toEqual(4);
      });

      it('creates complex chains of computed properties', function() {
        post.price = '20.00';
        expect(post.superDuperSalePrice).toEqual('-32 Wow! We owe YOU money!');
      });

      it('creates computed arrays', function() {
        post.price = '20.00';
        expect(post.allTheProperties).toEqual([ 'Ragin Shirt', true, '20.00', 1 ]);
      });

      it('creates computed objects', function() {
        post.price = '20.00';
        expect(post.prices).toEqual({ price : '20.00', salePrice : 16, superSalePrice : 4, superDuperSalePrice : '-32 Wow! We owe YOU money!' });
      });
    });
  });
});
