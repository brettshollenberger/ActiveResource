angular
  .module('ngActiveResource')
  .factory('ARLinkHeaders', ['ARHeaders', 'ARMixin', 'ARFunctional.Collection',
  function(Headers, mixin, FunctionalCollection) {

    var LinkHeaders = {
      parses: "link",
      parse: function(linkHeader) {
        return toHypermedia(linkHeader);
      }
    }

    function toHypermedia(LinkHeader) {
      if (!_.isString(LinkHeader)) { return; }

      return _.inject(
          _.zipObject(mixin(LinkHeader.split(","), FunctionalCollection)
            .map(function(rel) {
              return rel.split(";").reverse();
            })), function(hypermedia, value, key) {
              key = key.trim().replace(/^rel\=\"(\w+)\"/, function(orig, rel) {
                return rel;
                });

              value = url2obj(value.trim().replace(/[\<\>]/g, ""));

              hypermedia[key] = value;

              return hypermedia;
            },
            {});
    }

    function url2obj(url) {
      url = url.trim();

      var baseURL     = url.split("?")[0],
          paramString = url.split("?")[1],
          params      = {};

      if (!_.isUndefined(paramString)) {
        params = _.inject(paramString.split("&"), function(params, param) {
          var keyVal = param.split("="),
              key    = keyVal[0],
              val    = keyVal[1];

          if (!isNaN(val)) { val = Number(val); }

          params[key] = val;

          return params;
        }, {});

        return {
          url: baseURL,
          params: params
        }
      }
    }

    Headers.register(LinkHeaders);

    return LinkHeaders;

  }]);
