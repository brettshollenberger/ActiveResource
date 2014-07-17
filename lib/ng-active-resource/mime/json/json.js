angular
  .module('ngActiveResource')
  .factory('ARMime.JSON', ['ARMime', function(Mime) {
    var json = new Mime.Format({name: "json"});

    Mime.formats["json"].parsers.push(JSON.parse);
    Mime.formats["json"].formatters.push(JSON.stringify);

    return JSON;

  }]);
