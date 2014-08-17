angular
  .module('ngActiveResource')
  .factory('ARMime.JSON', ['ARMime', function(Mime) {
    var json            = new Mime.Format({name: "json"}),
        applicationJson = new Mime.Type({name: "application/json"});

    json.parsers.push(function(json) {
      if (_.isObject(json)) { return json; }
      if (_.isString(json)) { return JSON.parse(json); }
    });

    json.formatters.push(JSON.stringify);

    return json;

  }]);
