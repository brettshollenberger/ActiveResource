// Unified handler for remote responses
//
// Override default behavior via Class.whereHandler, Class.createHandler, etc.
//
angular
  .module('ngActiveResource')
  .factory('ARAPIResponseHandler', ['ARStrictRequire', function(strictRequire) {

    function APIResponseHandler(options) {
      strictRequire(options, ["action", "response", "deferred", "klass", "params"]);

      this.action     = options.action;
      this.response   = options.response;
      this.deferred   = options.deferred;
      this.klass      = options.klass;
      this.params     = options.params;

      this.rawHandler = function() {
        return _.isFunction(this.klass[this.action + "Handler"]) ? 
                 this.klass[this.action + "Handler"] :
                 defaultHandler;
      }

      this.klass.emit(this.action + ":data", this.response);

      this.resolve = this.rawHandler()(this.response);

      return this.resolve ? new Resolver(this) : new Rejecter(this);
    }

    function defaultHandler(response) {
      var status = String(response.status);
      return status[0] != "4" && status[0] != "5";
    }

    function Resolver(options) {
      options.klass.emit(options.action + ":complete", options.deferred, 
                         options.response.data, options.params);

      options.deferred.resolve(options.deferred);
    }

    function Rejecter(options) {
    }

    return APIResponseHandler;
  }]);
