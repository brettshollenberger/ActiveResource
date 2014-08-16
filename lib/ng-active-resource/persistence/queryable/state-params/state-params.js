angular
  .module('ngActiveResource')
  .factory('ARStateParams', [function() {

    StateParams.prototype.blacklist = [];
    StateParams.prototype.whitelist = [];

    StateParams.extended = function(klass) {
      klass.stateParams = new StateParams(klass);
    }

    function StateParams() {
      var stateParams = this;

      privateVariable(this, 'appendQueryString', function(params, config) {
        if (config.appendQueryString) {
          $location.url($location.path() + "?" + querystring.stringify(this.appendableParams(params)));
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

    return StateParams;

  }]);
