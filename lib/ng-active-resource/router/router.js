angular
  .module('ngActiveResource')
  .factory('ARRouter', ['$location', '$injector', function($location, $injector) {

    Router.prototype.router = "$route";

    function Router() {
      this.routes = $injector.get(this.router + "Wrapper").routes;
      return this;
    }

    return new Router();

  }]);
