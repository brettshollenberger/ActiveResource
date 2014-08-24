angular
  .module('ngActiveResource')
  .factory('$routeWrapper', ['$route', function($route) {

    function NgRouteWrapper() {
      return $route;
    }

    return new NgRouteWrapper();

  }]);
