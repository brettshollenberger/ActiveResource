angular
  .module('BaseClass')
  .factory('BCMime.JSON', ['BCMime', function(Mime) {
    var json = new Mime.Format({name: "json"});

    Mime.formats["json"].parsers.push(JSON.parse);
    Mime.formats["json"].formatters.push(JSON.stringify);

    return JSON;

  }]);
