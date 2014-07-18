angular
  .module('ngActiveResource')
  .factory('ARDefinable', [function() {

    Definable.included = function(klass) {
      klass.before("new", function(attributes) {
        klass.constructing = { attributes: attributes }
      });

      klass.after("new", function() {
        delete klass.constructing;
      });
    }

    function Definable() {
      var instance = this;

      new AttributeDefiner("string");
      new AttributeDefiner("integer", {integer: {ignore: /\,/g } });
      new AttributeDefiner("number",  {numericality: {ignore: /\,/g } });
      new AttributeDefiner("boolean", {boolean: true});

      function AttributeDefiner(name, validates) {
        instance["__" + name] = function(propertyName) {
          if (_.isObject(validates)) {
            var validations = {};
            validations[propertyName] = validates;
            this.constructor.validates(validations);
          }

          this[propertyName] = this.constructor.constructing.attributes[propertyName];
        }
      }
    }

    return Definable;
  }]);
