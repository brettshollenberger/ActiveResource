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
        paramsClone = this.whitelistParams(params);
        paramsClone = this.blacklistParams(params);

        return paramsClone;
      });

      privateVariable(this, 'whitelistParams', function(params) {
        return params;
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
