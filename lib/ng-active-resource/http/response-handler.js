// Unified handler for remote responses
//
// Override default behavior via Class.whereHandler, Class.createHandler, etc.
//
angular
  .module('ngActiveResource')
  .factory('ARHTTPResponseHandler', ['ARStrictRequire', function(strictRequire) {

    function HTTPResponseHandler(options) {
      strictRequire(options, ["action", "response", "deferred", "klass", "params"]);

      this.action   = options.action;
      this.response = options.response;
      this.status   = options.status  || 200;
      this.headers  = options.headers || function() { return {}; };
      this.deferred = options.deferred;
      this.klass    = options.klass;
      this.params   = options.params;
      this.success  = options.success;
      this.error    = options.error;

      this.handler = function() {
        return _.isFunction(this.klass[this.action + "Handler"]) ? 
                 this.klass[this.action + "Handler"] :
                 defaultHandler;
      }

      this.klass.emit(this.action + ":data", this.response);

      this.resolve = this.handler()(this.response, this.status, this.headers);

      return this.resolve ? new Resolver(this) : new Rejecter(this);
    }

    function defaultHandler(response, status, headers) {
      status = String(status);
      return status[0] != "4" && status[0] != "5";
    }

    function Resolver(options) {
      options.response = options.response.data;

      options.success(options);

      options.klass.emit(options.action + ":complete", options.deferred, 
                         options.response, options.params);

      options.deferred.resolve(options.response);
    }

    function Rejecter(options) {
      options.response.status  = options.response.status  || options.status;
      options.response.headers = options.response.headers || options.headers;

      options.error(options);

      options.klass.emit(options.action + ":fail", options.deferred,
                         options.response, options.params);

      options.deferred.reject();
    }

    return HTTPResponseHandler;
  }]);