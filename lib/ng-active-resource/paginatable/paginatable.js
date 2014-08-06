angular
  .module('ngActiveResource')
  .factory('ARPaginatable', ['ARMixin', 'ARFunctional.Collection', 'AREventable',
  function(mixin, FunctionalCollection, Eventable) {

    function Paginatable() {
      var options              = {},
          paginationHypermedia = {};

      this.paginate = function(paginationOptions) {
        var collection = this;
        options        = _.defaults({}, paginationOptions, {preload: true});

        this.parseHypermedia();

        if (options.preload) {
          this.preload(paginationHypermedia.next).then(function() {
            collection.parseHypermedia();
          });

          this.preload(paginationHypermedia.previous).then(function() {
            collection.parseHypermedia();
          });
        }
      }

      this.next_page = function() {
        var params     = {},
            collection = this;

        params[this.paginationAttribute()] = this.mostRecentCall[this.paginationAttribute()] + 1;

        return this.where(params).then(function() {
          collection.parseHypermedia();
          collection.preload(paginationHypermedia.next);
        });
      }

      this.previous_page = function() {
        var params     = {},
            collection = this;

        params[this.paginationAttribute()] = this.mostRecentCall[this.paginationAttribute()] - 1;

        return this.where(params).then(function() {
          collection.parseHypermedia();
          collection.preload(paginationHypermedia.previous);
        });
      }

      this.paginationHypermedia = function() {
        return paginationHypermedia;
      }

      this.preload = function(hypermedia) {
        if (!_.isObject(hypermedia) || !hypermedia.params) { return; }
        return this.where(hypermedia.params, {preload: true});
      }

      this.parseHypermedia = function() {
        var hypermedia = toHypermedia(this.__headers("Link")),
            pa         = this.paginationAttribute();

        if (_.isUndefined(hypermedia.previous)) {
          paginationHypermedia.previous = undefined;
        } else if (_.isUndefined(paginationHypermedia.previous) ||
          hypermedia.previous.params[pa] < paginationHypermedia.previous.params[pa]) {
          paginationHypermedia.previous = hypermedia.previous;
        }

        if (_.isUndefined(hypermedia.next)) {
          paginationHypermedia.next = undefined;
        } else if (_.isUndefined(paginationHypermedia.next) ||
          hypermedia.next.params[pa] > paginationHypermedia.next.params[pa]) {
          paginationHypermedia.next = hypermedia.next;
        }
      }
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

    // function Paginatable() {
    //   var paginatedCollection = this,
    //       __pages, __hypermedia;

    //   this.paginate = function(options) {
    //     options =  _.defaults({}, options, {preload: true, per_page: 20,
    //                               current_page: this.mostRecentCall[this.paginationAttribute()]},
    //                               {current_page: 1});

    //     _.each(options, function(value, option) {
    //       privateVariable(this, "__" + option, value);
    //     }, this);

    //     this.__preloadPreviousPage();
    //     this.__preloadNextPage();

    //     this.__storeHypermedia();
    //   }

    //   privateVariable(this, "__storeHypermedia", function() {
    //     console.log(this.__headers());
    //   });

    //   privateVariable(this, "current_page", function() {
    //     return this.__pages()[this.__current_page];
    //   });

    //   privateVariable(this, '__preloadPreviousPage', function() {
    //   });

    //   privateVariable(this, '__preloadNextPage', function() {
    //   });

    //   privateVariable(this, "__pages", function() {
    //     if (_.isUndefined(__pages) || __pages.__per_page != this.__per_page) {
    //       this.__rehashPages();
    //     }

    //     return __pages;
    //   });

    //   privateVariable(this, '__rehashPages', function() {
    //     var currentPageIndex = this.__firstPageAcquired()[this.paginationAttribute()];

    //     __pages = mixin(groupsOf(this, this.__per_page), FunctionalCollection)
    //     .inject(function(pages, page, index) {
    //       pages[currentPageIndex] = mixin(page, FunctionalCollection);
    //       currentPageIndex += 1;
    //       return pages;
    //     }, {__per_page: this.__per_page});
    //   });

    //   privateVariable(this, "__firstPageAcquired", function() {
    //     var mostRecentCall = _.cloneDeep(this.mostRecentCall);
    //     delete mostRecentCall.page;

    //     return _.chain(this.queries.where(mostRecentCall))
    //             .groupBy(this.paginationAttribute())
    //             .sortBy(function(query, page) {
    //               return page;
    //             })
    //             .first()
    //             .first()
    //             .value();
    //   });

    //   function groupsOf(array, n) {
    //     var groups = [],
    //         ids    = _.pluck(array, array[0].constructor.primaryKey);

    //     while (ids.length) {
    //       var groupIds = _.first(ids, n);
    //       var group    = _.select(array, function(el) { 
    //         return _.include(groupIds, el[el.constructor.primaryKey]); 
    //       });
    //       ids = _.reject(ids, function(id) { return _.include(groupIds, id); });
    //       groups.push(group);
    //     }

    //     return groups;
    //   }
    // }

    return Paginatable;

  }]);

//     function Paginatable() {
//       var paginatedCollection = this,
//           __acquiredQueries   = [],
//           __mostRecentCall    = {},
//           __headers, __pages;

//       mixin(this, FunctionalCollection, Eventable);

//       privateVariable(this, "paginate", function(options) {
//         options = new PaginateOptions(options, this);

//         _.each(options, function(value, option) {
//           privateVariable(this, "__" + option, value);
//         }, this);

//         this.__preloadPreviousPage();
//         this.__preloadNextPage();
//       });

//       privateVariable(this, "current_page", function() {
//         return this.__pages()[this.__current_page];
//       });

//       privateVariable(this, "next_page_exists", function() {
//         return !_.isUndefined(this.__next_page()) ||
//                !_.isUndefined(this.__next_page_hypermedia());
//       });

//       privateVariable(this, "previous_page_exists", function() {
//         return !_.isUndefined(this.__previous_page()) ||
//                !_.isUndefined(this.__previous_page_hypermedia());
//       });

//       privateVariable(this, "next_page", function() {
//         if (this.next_page_exists()) {
//           this.__current_page += 1;
//           this.__preloadNextPage();
//           this.emit("next_page:complete");
//         }
//       });

//       privateVariable(this, "previous_page", function() {
//         if (this.previous_page_exists()) {
//           this.__current_page -= 1;
//           this.__preloadPreviousPage();
//           this.emit("next_page:complete");
//         }
//       });

//       privateVariable(this, "__pages", function() {
//         if (_.isUndefined(__pages) || __pages.__per_page != this.__per_page) {
//           this.__rehashPages();
//         }

//         return __pages;
//       });

//       privateVariable(this, "__firstPageAcquired", function() {
//         return _.chain(__acquiredQueries)
//                 .pluck(this.__paginationAttribute())
//                 .sort()
//                 .first()
//                 .value();
//       });

//       privateVariable(this, '__rehashPages', function() {
//         var currentPageIndex = this.__firstPageAcquired();

//         __pages = mixin(groupsOf(this, this.__per_page), FunctionalCollection)
//                  .inject(function(pages, page, index) {
//                    pages[currentPageIndex] = mixin(page, FunctionalCollection);
//                    currentPageIndex += 1;
//                    return pages;
//                  }, {__per_page: this.__per_page});
//       });

//       privateVariable(this, "__preloadNextPage", function() {
//         var nextLink = this.__next_page_hypermedia();

//         if (this.__next_page_needs_loading() && !_.isUndefined(nextLink)) {
//           var url        = nextLink.url,
//               params     = nextLink.params,
//               collection = this,
//               klass      = collection.klass,
//               nextElements;

//           nextElements = klass.where(url, {params: params}).then(function(response) {
//             _.each(nextElements, function(element) { collection.push(element); });
//             collection.__rehashPages();
//             collection.__mostRecentCall = params;
//             collection.__headers = nextElements.__headers;
//           });
//         }
//       });

//       privateVariable(this, "__preloadPreviousPage", function() {
//         var previousLink = this.__previous_page_hypermedia();

//         if (this.__previous_page_needs_loading() && !_.isUndefined(previousLink)) {
//           var url        = previousLink.url,
//               params     = previousLink.params,
//               collection = this,
//               klass      = collection.klass,
//               previousElements;

//           previousElements = klass.where(url, {params: params}).then(function(response) {
//             _.each(previousElements.reverse(), function(element) { collection.unshift(element); });
//             collection.__rehashPages();
//             collection.__mostRecentCall = params;

//             var newHeaders     = previousElements.__headers(),
//                 newLinkHeader  = newHeaders.Link,
//                 oldLinkHeaders = collection.__headers("Link");

//             if (!_.isUndefined(newLinkHeader)) {
//               var newPrevHeader       = newLinkHeader.previous || newLinkHeader.prev;
//               oldLinkHeaders.previous = newPrevHeader
//             }

//             newHeaders["Link"] = oldLinkHeaders;

//             collection.headers = function(name) {
//               if (!_.isUndefined(name)) { return newHeaders[name]; }
//               return newHeaders;
//             }
//           });
//         }
//       });

//       privateVariable(this, "__paginationAttribute", function() {
//         return this.klass.api.paginationAttribute;
//       });

//       privateVariable(this, "__previous_page_needs_loading", function() {
//         return _.isUndefined(this.__next_page()) ||
//                 this.__next_page().length < this.__per_page;
//       });

//       privateVariable(this, "__next_page_needs_loading", function() {
//         return _.isUndefined(this.__next_page()) ||
//                 this.__next_page().length < this.__per_page;
//       });

//       privateVariable(this, "__hypermedia_exists", function() {
//         return !_.isUndefined(this.__next_page_hypermedia()) ||
//                !_.isUndefined(this.__previous_page_hypermedia());
//       });

//       privateVariable(this, "__next_page_hypermedia", function() {
//         return this.__hypermedia().next;
//       });

//       privateVariable(this, "__previous_page_hypermedia", function() {
//         return this.__hypermedia().previous || this.__hypermedia().prev;
//       });

//       privateVariable(this, "__hypermedia", function() {
//         return toHypermedia(this.__headers("Link"));
//       });

//       privateVariable(this, "__next_page", function() {
//         return this.__pages()[this.__current_page+1];
//       });

//       privateVariable(this, "__previous_page", function() {
//         return this.__pages()[this.__current_page-1];
//       });

//       privateVariable(this, "__acquiredQueries", function() {
//         return __acquiredQueries;
//       });

//       Object.defineProperty(this, "__mostRecentCall", {
//         enumerable: false,
//         configurable: true,
//         get: function()    { return __mostRecentCall; },
//         set: function(val) {
//           if (!_.isObject(val)) { return; }

//           val = _.cloneDeep(val);

//           if (_.isUndefined(val[this.__paginationAttribute()])) {
//             val[this.__paginationAttribute()] = 1;
//           }

//           __mostRecentCall = sortKeys(val);
//           __acquiredQueries.nodupush(__mostRecentCall);
//         }
//       });

//       function toHypermedia(LinkHeader) {
//         return _.inject(
//             _.zipObject(mixin(LinkHeader.split(","), FunctionalCollection)
//               .map(function(rel) {
//                 return rel.split(";").reverse();
//               })), function(hypermedia, value, key) {
//                 key = key.trim().replace(/^rel\=\"(\w+)\"/, function(orig, rel) {
//                   return rel;
//                   });

//                 value = url2obj(value.trim().replace(/[\<\>]/g, ""));

//                 if (!hypermediaPreviouslyAcquired(value.params)) {
//                   hypermedia[key] = value;
//                 }

//                 return hypermedia;
//               },
//               {});
//       }

//       function hypermediaPreviouslyAcquired(hypermedia) {
//         return _.include(_.map(__acquiredQueries, JSON.stringify), 
//                          JSON.stringify(sortKeys(hypermedia)));
//       }

//       function sortKeys(obj) {
//         return _.chain(obj)
//                 .keys()
//                 .sort()
//                 .transform(function(sorted, key) {
//                   sorted[key] = obj[key];
//                   return sorted;
//                 }, {})
//                 .value()
//       }
//     }

//     function PaginateOptions(options, pagination) {
//       options = options || {},
//       paginationAttribute = pagination.__paginationAttribute();

//       return _.defaults(options,
//       {
//         current_page: pagination.__mostRecentCall[paginationAttribute]
//       },
//       {
//         per_page: 20,
//         current_page: 1,
//         preload: true
//       });
//     }

//     function url2obj(url) {
//       url = url.trim();

//       var baseURL     = url.split("?")[0],
//           paramString = url.split("?")[1],
//           params      = {};

//       if (!_.isUndefined(paramString)) {
//         params = _.inject(paramString.split("&"), function(params, param) {
//           var keyVal = param.split("="),
//               key    = keyVal[0],
//               val    = keyVal[1];

//           if (!isNaN(val)) { val = Number(val); }

//           params[key] = val;

//           return params;
//         }, {});

//         return {
//           url: baseURL,
//           params: params
//         }
//       }

//     }

//     return Paginatable;

//   }]);
