angular
  .module('ngActiveResource')
  .factory('ARStateParams', ['$location', 'ARQueryString', 'ARRouter', function($location, querystring, router) {

    StateParams.prototype.blacklist = [];
    StateParams.prototype.whitelist = [];

    StateParams.extended = function(klass) {
      klass.stateParams = new StateParams(klass);
    }

    function StateParams() {
      var stateParams = this;

      privateVariable(this, 'parameterizeUrl', function(params) {
        var route         = bestRoute($location.path(), params),
        querystringParams = _.cloneDeep(params);

        route = route.replace(/\:(\w+)/, function(urlParam) {
          var paramName = urlParam.replace(":", ""),
              paramVal  = params[paramName];

          delete querystringParams[urlParam.slice(1)];

          return paramVal;
        });

        return route + "?" + querystring.stringify(this.appendableParams(querystringParams));
      });


      privateVariable(this, 'appendQueryString', function(params, config) {
        if (config.appendQueryString) {
          $location.url(this.parameterizeUrl(params));
          delete config.appendQueryString;
        }
      });

      privateVariable(this, 'appendableParams', function(params) {
        var paramsClone = _.cloneDeep(params);
        paramsClone = this.whitelistParams(paramsClone);
        paramsClone = this.blacklistParams(paramsClone);

        return paramsClone;
      });

      privateVariable(this, 'whitelistParams', function(params) {
        if (stateParams.whitelist.length) {
          return _.transform(params, function(result, value, key) {
            if (_.include(stateParams.whitelist, key)) {
              result[key] = value;
            }
            return result;
          }, {});
        } else {
          return params;
        }
      });

      privateVariable(this, 'blacklistParams', function(params) {
        return _.transform(params, function(result, value, key) {
          if (!_.include(stateParams.blacklist, key)) {
            result[key] = value;
          }
          return result;
        }, {});
      });
    }

    function bestRoute(currentRoute, queryData) {
      var possibleRoutes = _.keys(router.routes);
      var bestRoute      = _.chain(possibleRoutes)
                       .compact()
                       .map(function(route) { 
                         return [route, _.reject(route.split("/"), function(routePiece) { 
                           // keep only the url params
                           return routePiece[0] != ":"; 
                         })]; 
                       })
                      .reject(function(group) {
                        // keep only the routes that contain url params that are currently a part
                        // of the queryData object
                        return !_.include(_.chain(queryData)
                          .keys().map(function(k) { 
                            return ":" + k; 
                          })
                          .value(), _.first(group[1])); 
                      })
                      .map(function(group) { return group[0]; })
                      // .map(function(group) {
                      //   // keep the filtered url and replace the urlParams appropriately
                      //   return group[0].replace(/\:(\w+)/, function(urlParam) { 
                      //     var paramName = urlParam.replace(":", ""),
                      //          paramVal  = queryData[paramName];

                      //     return paramVal;
                      //   });
                      // })
                      .value();

      return bestRoute.length > 0 ? _.first(bestRoute) : currentRoute;
    }

    return StateParams;

  }]);
