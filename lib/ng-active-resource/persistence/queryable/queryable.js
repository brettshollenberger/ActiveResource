angular
  .module('ngActiveResource')
  .factory('ARQueryable', ['$http', 'ARMixin', 'ARFunctional.Collection', 'ARPaginatable', 
  'ARPromiseable', 'ARHTTPResponseHandler', 'ARHTTPConfig',
  function($http, mixin, FunctionalCollection, Paginatable, Promiseable, HTTPResponseHandler, 
  httpConfig) {

    function Queryable() {
      this.findAll = function(config) {
        return this.where({}, config);
      }

      this.where = function(terms, config) {
        var klass        = this,
            queryResults = mixin([], FunctionalCollection, Paginatable),
            terms        = standardizeTerms(),
            config       = _.merge({params: terms}, config, httpConfig(klass), _.defaults);

        queryResults.klass            = klass;
        queryResults.__mostRecentCall = config.params || {};
        queryResults.extend(Promiseable);

        this.watchedCollections.push(queryResults);

        klass.emit("where:called", terms);

        return returnRemote();

        function standardizeTerms() {
          return _.isObject(terms) ? terms : {};
        }

        function returnRemote() {
          var url = klass.api.generateRequest("index", config);

          $http.get(url, config).error(handleResponse).then(handleResponse)

            function handleResponse(response, status) {
              new HTTPResponseHandler({
                  action:   "where", 
                  url:      url,
                  response: response,
                  status:   status,
                  headers:  response.headers,
                  deferred: queryResults, 
                  klass:    klass, 
                  params:   terms, 
                  success:  onSuccess, 
                  error:    onError
              });
            }

          queryResults.defer();
          return queryResults;
        }
      }

      function onSuccess(success) {
        _.each(success.response, function(attributes) {
           success.deferred.push(success.klass.createOrUpdate(attributes));
        }, success.klass);
      }

      function onError(response) {
        response.deferred.response = response.response;

        if (response.deferred.response.data) { 
          response.deferred.response = response.deferred.response.data; 
        }
      }
    }

    return Queryable;

  }]);
