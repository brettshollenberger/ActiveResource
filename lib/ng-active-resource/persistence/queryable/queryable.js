angular
  .module('ngActiveResource')
  .factory('ARQueryable', ['$http', 'ARMixin', 'ARFunctional.Collection', 'ARPaginatable', 
  'ARPromiseable', 'ARHTTPResponseHandler', 'ARHTTPConfig', 'ARRefinable',
  function($http, mixin, FunctionalCollection, Paginatable, Promiseable, HTTPResponseHandler, 
  httpConfig, Refinable) {

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
