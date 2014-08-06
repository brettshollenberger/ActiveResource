angular
  .module('ngActiveResource')
  .factory('ARPaginatable', ['ARMixin', 'ARFunctional.Collection', 'AREventable',
  function(mixin, FunctionalCollection, Eventable) {

    function Paginatable() {
      var options              = {},
          paginationHypermedia = {},
          __headers;

      this.resetPagination = function() {
        paginationHypermedia = {};
      }

      this.paginate = function(paginationOptions) {
        options = _.defaults({}, paginationOptions, {preload: true});

        this.parseHypermedia();
        this.preloadNextAndPrevious();
      }

      this.next_page = function() {
        this.flip_page("next");
      }

      this.previous_page = function() {
        this.flip_page("previous");
      }

      this.flip_page = function(nextOrPrevious) {
        var params     = {},
            collection = this;

        params[this.paginationAttribute()] = nextOrPrevious == "next" ? this.current_page() + 1 : this.current_page() - 1;

        return this.where(params).then(function() {
          collection.parseHypermedia();
          collection.preload(paginationHypermedia[nextOrPrevious]);
        });
      }

      this.current_page = function() {
        return this.mostRecentCall[this.paginationAttribute()];
      }

      this.next_page_exists = function() {
        return this.page_exists("next");
      }

      this.previous_page_exists = function() {
        return this.page_exists("previous");
      }

      this.page_exists = function(nextOrPrevious) {
        var pageNumber = _.isObject(paginationHypermedia[nextOrPrevious]) ?
                           paginationHypermedia[nextOrPrevious].params[this.paginationAttribute()] : undefined;

        if (_.isUndefined(pageNumber)) { return false; }

        return nextOrPrevious == "next" ? this.current_page() <= pageNumber : this.current_page() >= pageNumber;
      }

      this.paginationHypermedia = function() {
        return paginationHypermedia;
      }

      this.preload = function(hypermedia) {
        if (!options.preload || !_.isObject(hypermedia) || !hypermedia.params) { return; }
        return this.where(hypermedia.params, {preload: true});
      }

      this.preloadNextAndPrevious = function() {
        var collection = this;

        if (options.preload) {
          this.preload(paginationHypermedia.next).then(function() {
            collection.parseHypermedia();
          });

          this.preload(paginationHypermedia.previous).then(function() {
            collection.parseHypermedia();
          });
        }
      }

      this.parseHypermedia = function() {
        if (_.isUndefined(this.__headers)) { return; }

        var hypermedia = toHypermedia(this.__headers("Link"));

        this.parseHypermedium(hypermedia, "next");
        this.parseHypermedium(hypermedia, "previous");
      }

      this.parseHypermedium = function(hypermedia, nextOrPrevious) {
        if (!_.isObject(hypermedia)) { return; }

        var pa = this.paginationAttribute();

        if (_.isUndefined(hypermedia[nextOrPrevious]) ||
            _.isUndefined(paginationHypermedia[nextOrPrevious]) ||
            compare()) {
          paginationHypermedia[nextOrPrevious] = hypermedia[nextOrPrevious];
        }

        function compare() {
          return nextOrPrevious == "next" ? hypermedia.next.params[pa] > paginationHypermedia.next.params[pa] :
                                            hypermedia.previous.params[pa] < paginationHypermedia.previous.params[pa];
        }
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

    return Paginatable;

  }]);
