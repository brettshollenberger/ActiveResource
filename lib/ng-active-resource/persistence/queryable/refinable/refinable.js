angular
  .module('ngActiveResource')
  .factory('ARRefinable', ['$http', 'ARMixin', 'ARFunctional.Collection', 'ARHTTPConfig', 
  'ARPromiseable', 'ARHTTPResponseHandler', 'ARQueryCache', 'ARPaginatable', 'AREventable',
  'ARParams', '$location', 'ARQueryString',
  function($http, mixin, FunctionalCollection, httpConfig, Promiseable, 
  HTTPResponseHandler, QueryCache, Paginatable, Eventable, Params, $location, querystring) {

    function Refinable(klass) {
      var refinable   = mixin([], FunctionalCollection);
      refinable.klass = klass;
      refinable.extend(Promiseable);
      refinable.extend(Eventable);
      mixin(refinable, Paginatable);

      klass.watchedCollections.push(refinable);

      privateVariable(refinable, "queries", new QueryCache());

      refinable.where = function(params, config) {
        var params = Params.standardize(standardizeParams(params)),
            config = _.merge({params: params}, config, httpConfig(klass), _.defaults);

        klass.stateParams.appendQueryString(params, config);

        if (!config.preload) {
          refinable.mostRecentCall = config.params || {};
        }

        refinable.klass.emit("where:called", params);

        return queryCached(params) ? refine(cachedQuery(params).objects) : fetchRemote(params, config);
      }

      refinable.paginationAttribute = function() {
        return refinable.klass.api.paginationAttribute;
      }

      refinable.perPageAttribute = function() {
        return refinable.klass.api.perPageAttribute;
      }

      function queryCached(params) {
        return !!cachedQuery(params);
      }

      function cachedQuery(params) {
        return refinable.queries.find(params);
      }

      function fetchRemote(params, config) {
        var url = klass.api.generateRequest("index", config);

        $http.get(url, config).error(handleResponse).then(handleResponse);

        refinable.defer();
        return refinable;

        function handleResponse(response, status) {
          new HTTPResponseHandler({
              action:   "where",
              url:      url,
              response: response,
              status:   status,
              headers:  response.headers,
              deferred: refinable,
              klass:    klass,
              params:   params,
              config:   config,
              success:  onSuccess,
              error:    onError
          });
        }
      }

      function createOrUpdate(instances) {
        return mixin(_.map(instances, function(instance) { return klass.createOrUpdate(instance); }),
                     FunctionalCollection);
      }

      function refine(instances) {
        refinable.$removeAll();
        _.each(instances, function(instance) { refinable.push(instance); });

        return refinable;
      }

      function onSuccess(success) {
        var newInstances = always(success);
        if (!success.config.preload)    { refine(newInstances); }
      }

      function onError(error) {
        error.deferred.response = error.response;

        if (error.deferred.response.data) {
          error.deferred.response = error.deferred.response.data;
        }
      }

      function always(response) {
        var newInstances = createOrUpdate(response.response);
        refinable.queries.cache(response.request.params, newInstances, response.headers);
        return newInstances;
      }

      function nonPaginationParamsChanged(params) {
        return _.chain(params)
                .keys()
                .reject(function(param) {
                  return param == refinable.perPageAttribute() ||
                         param == refinable.paginationAttribute();
                })
                .any(function(param) {
                  if (!_.isObject(refinable.mostRecentCall)) { return false; }
                  return params[param] != refinable.mostRecentCall[param];
                })
                .value();
      }

      function standardizeParams(params) {
        var defaults = {};
        defaults[refinable.paginationAttribute()] = 1;
        params = _.isObject(params) ? params : {};
        if (nonPaginationParamsChanged(params)) {
          return _.merge(params, {page: 1}, refinable.mostRecentCall, defaults, _.defaults);
        } else {
          return _.merge(params, refinable.mostRecentCall, defaults, _.defaults);
        }
      }

      return refinable;
    }

    return Refinable;

  }]);
