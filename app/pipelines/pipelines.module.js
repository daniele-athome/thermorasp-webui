'use strict';

angular.module('app.pipelines', ['ngRoute', 'app.core.pipelines', 'app.core.devices'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/pipelines', {
        redirectTo: '/pipelines/list'
    });
}]);
