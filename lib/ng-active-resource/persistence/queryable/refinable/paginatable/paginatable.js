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
//           ng-change="members.page(query)">
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
      var options        = {},
          mostRecentCall = {},
          paginationHypermedia;

      this.paginate = function(paginationOptions) {
        options = _.defaults({}, paginationOptions, {preload: true});

        this.preloadNextAndPreviousPagination();
        this.paginated = true;
      }

      this.current_page = function() {
        return Number(this.mostRecentCall[this.paginationAttribute()]);
      }

      this.page = function(pageNumber) {
        var params     = {},
            collection = this;

        params[this.paginationAttribute()] = pageNumber;

        return this.where(params).then(function() {
          collection.preloadNextAndPreviousPagination();
        });
      }

      this.next_page = function() {
        this.flip_page("next");
      }

      this.previous_page = function() {
        this.flip_page("previous");
      }

      this.next_page_exists = function() {
        return this.page_exists("next");
      }

      this.previous_page_exists = function() {
        return this.page_exists("previous");
      }

      privateVariable(this, 'flip_page', function(nextOrPrevious) {
        var params     = {},
            collection = this;

        params[this.paginationAttribute()] = nextOrPrevious == "next" ?
                                             this.current_page() + 1 : this.current_page() - 1;

        return this.where(params).then(function() {
          collection.preloadPagination(collection.paginationHypermedia()[nextOrPrevious]);
        });
      });

      privateVariable(this, 'page_exists', function(nextOrPrevious) {
        return this.hypermedia_exists(nextOrPrevious) || this.pagePreloaded(nextOrPrevious);
      });

      privateVariable(this, 'hypermedia_exists', function(nextOrPrevious) {
        var pageNumber;

        if (_.isObject(this.paginationHypermedia() && this.paginationHypermedia()[nextOrPrevious])) { 
          pageNumber = this.paginationHypermedia()[nextOrPrevious].params[this.paginationAttribute()];
        }

        if (_.isUndefined(pageNumber)) {
          return false;
        }
        return nextOrPrevious == 'next' ? this.current_page() < pageNumber : this.current_page() > pageNumber;
      });

      privateVariable(this, 'pagePreloaded', function(nextOrPrevious) {
        var pageInQuestion = nextOrPrevious == 'next' ? this.current_page() + 1 : this.current_page() - 1, defaults = {};
        defaults[this.paginationAttribute()] = pageInQuestion;
        var params = _.defaults(defaults, this.mostRecentCall);
        return this.preloaded({ params: params });
      });

      privateVariable(this, 'paginationHypermedia', function() {
        if (this.queries.find(this.mostRecentCall)) {
          return this.queries.find(this.mostRecentCall).headers.link || {};
        }
      });

      privateVariable(this, 'preloadNextAndPreviousPagination', function() {
        var collection = this;

        if (options.preload) {
          this.preloadPagination(this.paginationHypermedia().next);
          this.preloadPagination(this.paginationHypermedia().previous);
        }
      });

      privateVariable(this, 'preloadPagination', function(hypermedia) {
        if (!options.preload || !_.isObject(hypermedia) ||
            !hypermedia.params || !this.shouldPreload(hypermedia)) { 
          this.defer();
          return this;
        }
        return this.where(hypermedia.params, {preload: true});
      });

      // Only preload the next or previous page--don't get crazy with the preloading
      privateVariable(this, 'shouldPreload', function(hypermedia) {
        return Math.abs(hypermedia.params.page - this.current_page()) == 1 && !this.preloaded(hypermedia);
      });

      privateVariable(this, 'preloaded', function(hypermedia) {
        return !!this.queries.find(hypermedia.params);
      });
    }

    return Paginatable;

  }]);

