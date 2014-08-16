angular
  .module('ngActiveResource')
  .factory('ARQueryable', ['$http', 'ARMixin', 'ARFunctional.Collection', 'ARPaginatable', 
  'ARPromiseable', 'ARHTTPResponseHandler', 'ARHTTPConfig', 'ARRefinable', 'ARStateParams',
  function($http, mixin, FunctionalCollection, Paginatable, Promiseable, HTTPResponseHandler, 
  httpConfig, Refinable, StateParams) {

    Queryable.extended = function(klass) {
      klass.extend(StateParams);
    }

    function Queryable() {
      this.findAll = function(config) {
        return this.where({}, config);
      }

      this.where = function(terms, config) {
        var klass        = this,
            queryResults = new Refinable(klass);

        return queryResults.where(terms, config);
      }
    }

    return Queryable;

  }]);
