'use strict';

angular.module('app.devices')

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/devices/list', {
        templateUrl: 'devices/device-list.template.html',
        controller: 'DevicesListCtrl'
    });
}])

.controller('DevicesListCtrl', ['$scope', 'Devices', function($scope, Devices) {
    Devices.boilers().then(function(data) {
        $scope.devices = data;
    });
}]);