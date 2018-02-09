'use strict';

angular.module('app.devices', ['ngRoute', 'app.core.devices'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/devices', {
        redirectTo: '/devices/list'
    });
}]);
