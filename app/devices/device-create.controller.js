'use strict';

angular.module('app.devices')

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/devices/create', {
        templateUrl: 'devices/device-create.template.html',
        controller: 'DevicesCreateCtrl'
    });
}])

.controller('DevicesCreateCtrl', ['$scope', '$location', '$timeout', 'Flash', 'Devices',
function($scope, $location, $timeout, Flash, Devices) {
    $scope.device = {};

    $scope.save = function(device) {
        console.log(device);
        Devices.register(device).then(function(data) {
            $location.path('/devices/list');
            $timeout(function() {
                // TODO i18n
                Flash.create('success', 'Boiler created.');
            }, 100);
        })
        .catch(function(e) {
            // TODO error
            console.log(e);
        });
    }

}]);
