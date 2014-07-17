angular
  .module("BaseClass")
  .factory("BCMime.Formattable", ["BCMime", "BCMime.XML", "BCMime.JSON", function(Mime, XML, JSON) {

    function Formattable() {
      this.__toXml = function() {
        return Mime.format({type: "xml", data: this});
      }

      this.__toJson = function() {
        return Mime.format({type: "json", data: this});
      }
    }

    return Formattable;

  }]);
