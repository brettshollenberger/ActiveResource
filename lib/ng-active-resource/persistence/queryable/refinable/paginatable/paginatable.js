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
        var pageNumber = _.isObject(this.paginationHypermedia[nextOrPrevious]) ?
                           this.paginationHypermedia[nextOrPrevious].params[this.paginationAttribute()] : undefined;

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

      privateVariable(this, 'paginationHypermedia', function() {
        if (mostRecentCall != this.mostRecentCall) {
          mostRecentCall       = this.mostRecentCall;
          paginationHypermedia = this.queries.find(this.mostRecentCall).headers.link;
        }

        return paginationHypermedia;
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
      this.shouldPreload = function(hypermedia) {
        return Math.abs(hypermedia.params.page - this.current_page()) == 1 && !this.preloaded(hypermedia);
      }

      this.preloaded = function(hypermedia) {
        return !!this.queries.find(hypermedia.params);
      }
    }

    return Paginatable;

  }]);

