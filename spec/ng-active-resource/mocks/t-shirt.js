angular
  .module('Mocks')
  .factory('TShirt', ['ngActiveResource', function(ngActiveResource) {

    function TShirt(attributes) {
      this.number("price");
      this.number("order_id");
      this.boolean("available");
      this.string("name");

      this.computedProperty('salePrice', function() {
        return this.price - (this.price * 0.2);
      }, 'price');

      this.computedProperty('superSalePrice', function() {
        return this.price - this.salePrice;
      }, ['price', 'salePrice']);

      this.computedProperty('superDuperSalePrice', function() {
        return this.superSalePrice - this.salePrice - this.price + ' Wow! We owe YOU money!';
      }, ['price', 'salePrice', 'superSalePrice']);

      this.computedProperty('allTheProperties', function() {
        return [this.name, this.available, this.price, this.order_id];
      }, ['order_id', 'price', 'available', 'name']);

      this.computedProperty('prices', function() {
        var instance = this;
        return {
          price: instance.price,
          salePrice: instance.salePrice,
          superSalePrice: instance.superSalePrice,
          superDuperSalePrice: instance.superDuperSalePrice
        };
      }, ['price', 'salePrice', 'superSalePrice', 'superDuperSalePrice']);
    };

    TShirt.inherits(ngActiveResource.Base);
    return TShirt;
  }]);
