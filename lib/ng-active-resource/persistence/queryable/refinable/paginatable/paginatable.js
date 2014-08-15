// module Paginatable
//
// Paginate your collection:
//
//  // controller
//  $scope.query = {district_id: 1, per_page: 10});
//
//  $scope.members = Member.where(query).then(function() {
//    $scope.members.paginate();
//  });
//
//  // view
//  <div ng-repeat="member in members">
//    <p>{{member.body}}</p>
//  </div>
//
//  <button ng-click="members.next_page()" ng-enabled="members.next_page_exists()">
//    Next
//  </button>
//
//  <div>
//    Page: <input
//           ng-model="query.page"
//           value="members.current_page()"
//           ng-change="members.where(query)">
//  </div>
//
//  <button ng-click="members.previous_page()" ng-enabled="members.previous_page_exists()">
//    Previous
//  </button>
//
// If you change parameters other than your pagination attribute (page by default), then the
// pagination will automatically reset to page 1.
//
//  <div class="filters">
//    <input ng-model="query.school_id" ng-change="members.where({school_id: query.school_id})">
//  </div>
//
// In the example above, refining the query to include school_id will reset the pagination to page 1.
//
angular
  .module('ngActiveResource')
  .factory('ARPaginatable', ['ARMixin', 'ARFunctional.Collection',
  function(mixin, FunctionalCollection) {

    function Paginatable() {
      var options              = {},
          paginationHypermedia = {},
          preloaded            = [],
          __headers;

      this.paginate = function(paginationOptions) {
        options = _.defaults({}, paginationOptions, {preload: true});

        this.parseHypermedia();
        this.preloadNextAndPrevious();
        this.paginated = true;
      }

      this.page = function(pageNumber) {
        var params     = {},
            collection = this;

        params[this.paginationAttribute()] = pageNumber;

        return this.where(params).then(function() {
          collection.parseHypermedia();
          collection.preloadNextAndPrevious();
        });
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
        return Number(this.mostRecentCall[this.paginationAttribute()]);
      }

      this.next_page_exists = function() {
        return this.page_exists("next");
      }

      this.previous_page_exists = function() {
        return this.page_exists("previous");
      }

      this.page_exists = function(nextOrPrevious) {
        return this.hypermedia_exists(nextOrPrevious) || this.pagePreloaded(nextOrPrevious);
      }

      this.hypermedia_exists = function(nextOrPrevious) {
        var pageNumber = _.isObject(paginationHypermedia[nextOrPrevious]) ?
                           paginationHypermedia[nextOrPrevious].params[this.paginationAttribute()] : undefined;

        if (_.isUndefined(pageNumber)) { return false; }

        return nextOrPrevious == "next" ? this.current_page() < pageNumber : this.current_page() > pageNumber;
      }

      this.pagePreloaded = function(nextOrPrevious) {
        var pageInQuestion = nextOrPrevious == "next" ? this.current_page() + 1 : this.current_page() - 1,
            defaults       = {};

        defaults[this.paginationAttribute()] = pageInQuestion;

        var params = _.defaults(defaults, this.mostRecentCall);

        return this.preloaded({params: params});
      }

      this.paginationHypermedia = function() {
        return paginationHypermedia;
      }

      // Only preload the next or previous page--don't get crazy with the preloading
      this.shouldPreload = function(hypermedia) {
        return Math.abs(hypermedia.params.page - this.current_page()) == 1 && !this.preloaded(hypermedia);
      }

      this.preloaded = function(hypermedia) {
        return !!this.queries.find(hypermedia.params);
      }

      this.preload = function(hypermedia) {
        if (!options.preload || !_.isObject(hypermedia) ||
            !hypermedia.params || !this.shouldPreload(hypermedia)) { 
          this.defer();
          return this;
        }
        return this.where(hypermedia.params, {preload: true});
      }

      this.preloadNextAndPrevious = function() {
        var collection = this,
            deferred;

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

      // When the collection is re-queried with non-pagination params, we reset pagination.
      //
      // Preload queries may have been sent out in the meantime. If they were, we don't want to
      // reset pagination information to the preloaded queries. We want to wait until we receive
      // the response from the new query to reset pagination.
      this.resetPagination = function(params) {
        paginationHypermedia = {};

        this.after("where", function(collection, response, request) {
          if (params == request.params) {
            this.paginate();
            this.unbind();
          }
        });
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
