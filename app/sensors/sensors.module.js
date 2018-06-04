'use strict';

angular.module('app.sensors', ['ngRoute', 'app.core.sensors', 'app.utils'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/sensors', {
        redirectTo: '/sensors/list'
    });
}]);
