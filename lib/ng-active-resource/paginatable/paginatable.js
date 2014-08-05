angular
  .module('ngActiveResource')
  .factory('ARPaginatable', ['ARMixin', 'ARFunctional.Collection', 'AREventable', '$http',
  'ARHTTPResponseHandler',
  function(mixin, FunctionalCollection, Eventable, $http, HTTPResponseHandler) {

    function Paginatable() {
      mixin(this, FunctionalCollection, Eventable);

      var __pages,
          paginatedCollection = this;

      privateVariable(this, "__pages", function() {
        if (_.isUndefined(__pages) || __pages.__per_page != this.__per_page) {
          this.__rehashPages();
        }

        return __pages;
      });

      privateVariable(this, '__rehashPages', function() {
        __pages = mixin(groupsOf(this, this.__per_page), FunctionalCollection)
                 .inject(function(pages, page, index) {
                   pages[index] = mixin(page, FunctionalCollection);
                   return pages;
                 }, {__per_page: this.__per_page});
      });

      privateVariable(this, "paginate", function(options) {
        options = new PaginateOptions(options);

        _.each(options, function(value, option) {
          privateVariable(this, "__" + option, value);
        }, this);
      });

      privateVariable(this, "current_page", function() {
        return this.__pages()[this.__current_page-1];
      });

      privateVariable(this, "next_page", function() {
        this.__current_page += 1;
        this.__preloadNextPage();
        this.emit("next_page:complete");
      });

      privateVariable(this, "previous_page", function() {
        this.__current_page -= 1;
        this.emit("next_page:complete");
      });

      privateVariable(this, "klass", function() {
        return this[0].constructor;
      });

      // privateVariable(this, "current_page", function() {
      //   return mixin(this.slice(this.__index_start(), this.__index_end()), FunctionalCollection);
      // });

      // privateVariable(this, "__index_start", function() {
      //   return Number(this.__current_page - 1) * Number(this.__per_page);
      // });

      // privateVariable(this, "__index_end", function() {
      //   return Number(this.__index_start() + this.__per_page);
      // });

      privateVariable(this, "__preloadNextPage", function() {
        var nextLink = this.__next_page_hypermedia();

        if (this.__next_page_needs_loading() && !_.isUndefined(nextLink)) {
          var url        = nextLink.url,
              params     = nextLink.params,
              collection = this,
              klass      = collection.klass(),
              nextElements;

          nextElements = klass.where(url, {params: params}).then(function(response) {
            _.each(nextElements, function(element) { collection.push(element); });
            collection.__headers = nextElements.__headers;

            collection.__rehashPages();
          });
        }
      });

      privateVariable(this, "__next_page_needs_loading", function() {
        return _.isUndefined(this.__next_page()) ||
                this.__next_page().length < this.__per_page;
      });

      privateVariable(this, "__next_page_hypermedia", function() {
        return toHypermedia(this.__headers("Link")).next;
      });

      privateVariable(this, "__next_page", function() {
        return this.__pages()[this.__current_page];
      });

      privateVariable(this, "__previous_page", function() {
        return this.__pages()[this.__current_page-2];
      });

      // privateVariable(this, "__preloadPreviousPage", function() {
      // });

    }

    function PaginateOptions(options) {
      options = options || {};
      return _.defaults(options, {
        per_page: 20,
        current_page: 1,
        preload: true
      });
    }

    function toHypermedia(LinkHeader) {
      return _.inject(
              _.zipObject(mixin(LinkHeader.split(","), FunctionalCollection)
               .map(function(rel) {
                 return rel.split(";").reverse();
               })), function(hypermedia, value, key) {
                 key = key.trim().replace(/^rel\=\"(\w+)\"/, function(orig, rel) {
                   return rel;
                 });

                 value = value.replace(/[\<\>]/g, "");

                 hypermedia[key] = url2obj(value);

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

    function groupsOf(array, n) {
      var groups = [],
          ids    = _.pluck(array, array[0].constructor.primaryKey);

      while (ids.length) {
        var groupIds = _.first(ids, n);
        var group    = _.select(array, function(el) { 
          return _.include(groupIds, el[el.constructor.primaryKey]); 
        });
        ids = _.reject(ids, function(id) { return _.include(groupIds, id); });
        groups.push(group);
      }

      return groups;
    }

    return Paginatable;

  }]);
