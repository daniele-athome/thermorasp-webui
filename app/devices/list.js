'use strict';

angular.module('app.devices')

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/devices/list', {
        templateUrl: 'devices/list.html',
        controller: 'DevicesListCtrl'
    });
}])

.controller('DevicesListCtrl', ['$scope', 'Devices', function($scope, Devices) {
    // TODO
    $scope.devices = Devices.query();
}]);
