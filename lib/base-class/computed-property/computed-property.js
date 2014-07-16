angular
  .module('BaseClass')
  .factory('BCComputedProperty', [function() {
    function ComputedProperty() {
      // Instance#computedProperty(name, valueFn, dependents)
      //
      // @param name       {string}         - The name of the property to be computed from other properties
      //
      // @param valueFn    {func}           - The function used to compute the new property from the others
      //
      // @param dependents {string | array} - The name of the property or list of the properties that this 
      //                                      property depends upon.
      //
      // Example:
      //
      //    function Tshirt(attributes) {
      //      this.number('price');
      //
      //      this.computedProperty('salePrice', function() {
      //        return this.price - (this.price * 0.2);
      //      }, 'price');
      //
      //      this.computedProperty('superSalePrice', function() {
      //        return this.price - this.salePrice;
      //      }, ['price', 'salePrice']);
      //    }
      //
      // The computed property function creates configurable getters and setters (that can thus be reconfigured).
      // In the first example, the price setter calls the salePrice setter whenever it updates. In the second
      // example, the salePrice setter continues to be called by the price setter, and additionally calls the
      // superSalePrice setter afterward.
      //
      // This chainability allows us to create complex inter-dependencies, where an update to one property
      // updates many others. In order to all this to occur, we use the `__lookupSetter__` function to retrieve
      // the value of the previous setter.
      this.__computedProperty = function(name, valueFn, dependents) {

        var instance = this;
        var data     = this.constructor.constructing.attributes;

        if (!dependents) dependents = [];
        if (!dependents.push) dependents = [dependents];

        var local2;
        Object.defineProperty(instance, name, {
          enumerable: true,
          configurable: true,
          get: function() { return local2; },
          set: function() {
            local2 = valueFn.apply(instance);
            return local2;
          }
        });

        _.each(dependents, function(dependent) {
          var local;
          var previousSetter = instance.__lookupSetter__(dependent);
          var dependentVal   = instance[dependent];

          Object.defineProperty(instance, dependent, {
            enumerable: true,
            configurable: true,
            get: function()    { return local; },
            set: function(val) {
              if (val !== undefined && val != 'set') local = val;
              if (previousSetter) {
                if (local == val) previousSetter();
                else local = previousSetter();
              }
              instance[name] = 'set';
              return local;
            }
          });
          if (data && data[dependent]) instance[dependent] = data[dependent];
          else instance[dependent] = dependentVal;
        });
      };
    }

    return ComputedProperty;
  }]);

