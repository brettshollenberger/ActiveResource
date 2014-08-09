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
  .factory('ARComputedProperty', ['AREventable.Array', function(EventableArray) {
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

      // Computed Properties
      //
      // Problem 1:
      //
      // You are creating a CMS, and want to generate a "munged" article URL as the user enters the name
      // of the article. The munged title should update in real-time, with all the magic of Angular's
      // two-way data binding.
      //
      // Solution 1:
      //
      // Declare a computed property named "mungedTitle" with a dependency on "title":
      //
      //    function Article() {
      //      this.string("title");
      //
      //      // "My Great Post" => "my-great-post"
      //      this.computedProperty("mungedTitle", function() {
      //        if (_.isUndefined(title)) { return ""; }
      //
      //        return this.title.split(" ").join("-").toLowerCase();
      //      }, "title");
      //    }
      //
      // The magical part is that data-binding just works:
      //
      //    <input ng-model="article.title">
      //    {{article.mungedTitle}}
      //
      // Problem 2:
      //
      // You want to generate the full name of a user from their first and last name.
      //
      // Solution 2:
      //
      // The computed value depends on two properties. So you define an array of dependencies; when either
      // changes, the computed value changes along with it:
      //
      //    function User() {
      //      this.string("firstName");
      //      this.string("lastName");
      //
      //      this.computedProperty("fullName", function() {
      //        return this.firstName + " " + this.lastName;
      //      }, ["firstName", "lastName"]);
      //    }
      //
      // Problem 3:
      //
      // You are creating an inventory calculator with special rules for computing the price of items and
      // the sale price of items.
      //
      // The rule for computing the price of an item is "the sale price plus $5." The rule for computing
      // the sale price is "the price minus $5."
      //
      // To help your in-store managers, you generate one or the other. If the user enters the price,
      // the sale price is computed. If they enter the sale price, the price is computed.
      //
      // Solution 3:
      //
      // You have two co-dependent computed properties:
      //
      //    function Item() {
      //      this.computedProperty('price', function() {
      //        return this.salePrice + 5;
      //      }, 'salePrice');
      //
      //      this.computedProperty('salePrice', function() {
      //        return this.price - 5;
      //      }, 'price');
      //    }
      //
      // Problem 4:
      //
      // You are building a real-time Battleship game. A player has lost the game if all of their ships are
      // sunk. You want the "lost" property to update automatically when every ship for a player is sunk.
      //
      // Solution 4:
      //
      // Your computed property depends on the property "sunk" in an array of ships. You can declare a
      // computed property chain:
      //
      //    Ship.belongsTo("player");
      //
      //    function Ship() {
      //      this.string("state");
      //
      //      this.computedProperty("sunk", function() {
      //        return this.state == "sunk";
      //      }, "state");
      //    }
      //
      //    Player.hasMany("ships");
      //
      //    function Player() {
      //      this.computedProperty("lost", function() {
      //        return this.ships.all(function(ship) { return ship.sunk; });
      //      }, "ships.sunk");
      //    }
      function buildComputedProperty(name, valueFn, dependents) {
          var cache = [];
        var instance     = this;
        var data         = this.constructor.constructing.attributes;
        privateVariable(instance, 'justSet', []);

        if (!dependents)      { dependents = [];           }
        if (!dependents.push) { dependents = [dependents]; }

        _.each(dependents, function (dependent) {
          var local,
              dependencyChain      = dependent.split("."),
              hasChildDependencies = dependencyChain.length > 1,
              dependent            = hasChildDependencies ? dependencyChain[0] : dependent,
              childDependencies    = dependencyChain.slice(1),
              originalVal          = instance[dependent];

          // Whenever the watched property is set to something else, notify the watching instance
          // Object.defineProperty(instance, dependent, {
          //   enumerable: true,
          //   configurable: true,
          //   get: function () {
          //     return local;
          //   },
          //   set: function (val) {
          //     local = val;
          //     instance.emit(dependent + ":set");
          //     return local;
          //   }
          // });

          watchProperty(instance, dependent);

          instance.on(dependent + ":set", setVal);

          function setVal() {
            // Allow inter-dependencies between properties without creating an infinite loop between them.
            instance.justSet.push(dependent);
            if (!_.include(instance.justSet, name)) { 
              instance[name] = valueFn.apply(instance); 
            }
            instance.justSet = [];
          }

          instance[dependent] = originalVal;

          // Watch child dependencies for changes, calling setVal as appropriate
          if (childDependencies.length) {
            _.each(childDependencies, function(childDependency) {
              watch(instance[dependent], childDependency, function(change) {
              });
            });
          }

          function watch(obj, propName) {
            if (_.isUndefined(obj)) { return; }

            // if (fn === void 0 && typeof propName == 'function') {
            //   fn       = propName;
            //   propName = undefined;
            // }

            if (_.isFunction(obj.push)) {
              watchArray(obj, propName);
              return;
            }
            if (propName) {
              if (propName.constructor.name == 'String') {
                watchProperty(obj, propName);
                return;
              }
            }
            for (var i in obj) {
              watchProperty(obj, i);
            }
          }

          function watchArray(array, propName) {
            array = mixin(array, EventableArray);

            array.on("push", function(newElements) {
              _.each(newElements, function(newElement) {
                watch(newElement, propName);
              });
            });
          }


          function watchProperty(obj, property) {
            var local;
            Object.defineProperty(obj, property, {
              enumerable: true,
              configurable: true,
              get: function () {
                return local;
              },
              set: function (val) {
                local = val;
                instance.emit(property + ":set");
                return local;
              }
            });
          }
        });
      }
    }

    return ComputedProperty;
  }]);

