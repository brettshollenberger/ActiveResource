// ComputedProperty(name, valueFn, dependents)
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
// The computed property function creates dynamically evaluated relationships between properties. In the example above,
// a change to the price of an item updates its salePrice automatically, and an update to either price or salePrice automatically
// updates the superSalePrice.
//
// Computed property actually allows you to create inter-dependent relationships:
//
//    function Order() {
//      this.computedProperty('price', function() {
//        return this.salePrice + 5;
//      }, 'salePrice');
//
//      this.computedProperty('salePrice', function() {
//        return this.price - 5;
//      }, 'price');
//    }
//
// In the example above, an update to price updates the salePrice, and an update to salePrice updates the price. Even with entire
// models of complex inter-dependencies, these computed properties will update one another without causing an infinite cycle.
//
// An example use-case is a spreadsheet application, where updating one field should cause related fields to update, and likewise
// updating the related field should cause the same update.
angular
  .module('ngActiveResource')
  .factory('ARComputedProperty', [function() {
    function ComputedProperty() {
      this.__computedProperty = function(name, valueFn, dependents) {
        if (!this.computedProperties) { privateVariable(this, 'computedProperties', []); }
        this.computedProperties.push([name, valueFn, dependents]);
      }

      this.__buildComputedProperties = function() {
        _.each(this.computedProperties, function(computedProperty) {
          buildComputedProperty.apply(this, computedProperty)
        }, this);

        delete this.__buildComputedProperties;
        delete this.computedProperties;
      }

      function buildComputedProperty(name, valueFn, dependents) {
        var instance     = this;
        var data         = this.constructor.constructing.attributes;
        instance.justSet = [];

        if (!dependents)      { dependents = [];           }
        if (!dependents.push) { dependents = [dependents]; }

        _.each(dependents, function (dependent) {
          var local,
              originalVal = instance[dependent],
              previousSetter = instance.__lookupSetter__(dependent);

          Object.defineProperty(instance, dependent, {
            enumerable: true,
            configurable: true,
            get: function () {
              return local;
            },
            set: function (val) {
              local = val;
              instance.emit(dependent + ":set");
              return local;
            }
          });

          // Allow inter-dependencies between properties without creating
          // an infinite loop between them.
          instance.on(dependent + ":set", function() {
            instance.justSet.push(dependent);
            if (!_.include(instance.justSet, name)) {
              instance[name] = valueFn.apply(instance);
            }
            instance.justSet = [];
          });

          instance[dependent] = originalVal;
        });
      }
    }

    return ComputedProperty;
  }]);

