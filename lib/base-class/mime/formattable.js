angular
  .module("BaseClass")
  .factory("BCMime.Formattable", ["BCMime", "BCMime.XML", function(Mime, XML) {

    function Formattable() {
      this.__toXML = function() {
        return Mime.format({type: "xml", data: this});
      }
    }

    return Formattable;

  }]);
