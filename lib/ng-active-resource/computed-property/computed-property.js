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
//
// NOTICE: In the example above, we say that the player's "lost" property relies on the ship's 
// "sunk" property, not its "state" property.
//
// This is because "sunk" is itself a computed property. If Player listened for ship#state and
// Ship listened for ship#state, then we would run the risk of having the Player callback fire
// before the Ship callback.
//
// Since Player _actually_ relies on knowing whether or not the Ship has sunk, and not on whether
// or not its state has changed in general, we must ensure that the ship#sunk dependency has finished
// evaluating before the player#lost callback fires.
//
// These differences are subtle, but necessary to understand for event-driven programming.
//
angular
  .module('ngActiveResource')
  .factory('ARComputedProperty', ['AREventable.Array', 'ARMixin', function(EventableArray, mixin) {
    function ComputedProperty() {

      // Build out computed property descriptors.
      //
      // Computed properties rely on Eventable objects, and must wait until the object has finished
      // initializing in order to build successfully.
      this.__computedProperty = function(name, valueFn, dependents) {
        if (!this.computedProperties) { privateVariable(this, 'computedProperties', []); }
        this.computedProperties.push([name, valueFn, dependents]);
      }

      // Build each computed property
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
              watch(instance[dependent], childDependency);
              instance.on(childDependency + ":set", setVal);
            });
          }

          function watch(obj, propName) {
            if (_.isUndefined(obj)) { return; }

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
            var setter     = obj.__lookupSetter__(property);
            var currentVal = obj[property];

            (function(obj, property) {
              var val = currentVal;

              if (_.isUndefined(setter)) {
                setter = function(value) { return val = value; }
              }

              Object.defineProperty(obj, property, {
                enumerable: true,
                configurable: true,
                get: function() {
                  return val;
                },
                set: function(value) {
                  val = setter(value);
                  instance.emit(property + ":set");
                  return val;
                }
              });

            })(obj, property);
          }
        });
      }
    }

    return ComputedProperty;
  }]);

