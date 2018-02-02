'use strict';

angular.module('myApp.devices', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/devices/list', {
            templateUrl: 'devices/list.html',
            controller: 'DevicesListCtrl'
        });
        console.log('CAZZO');
    }])

    .controller('DevicesListCtrl', ['$scope', function($scope) {
        // TODO
    }]);
