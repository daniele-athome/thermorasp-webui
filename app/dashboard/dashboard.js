'use strict';

angular.module('myApp.dashboard', ['ngRoute', 'ngHTTPPoll'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/dashboard', {
        templateUrl: 'dashboard/dashboard.html',
        controller: 'DashboardCtrl'
    });
}])

.controller('DashboardCtrl', ['$scope', 'dashboardStatusService', function($scope, dashboardStatusService) {
    $scope.thermostatDial = new thermostatDial(document.getElementById('dashboard-thermostat'), {
        onSetTargetTemperature: function (targetTemperature) {
            // TODO alter pipeline
            console.log(targetTemperature);
        }
    });
    dashboardStatusService.pollStatus($scope.thermostatDial);
}])

.factory('dashboardStatusService', ['$http', '$httpoll', function ($http, $httpoll) {
    return {
        // FIXME hard-coding all the way!!!

        pollStatus: function(dial) {
            // target temperature from active pipeline
            $http({
               url: '/api/pipelines/active',
            })
            .then(function(res) {
                if (res.data && res.data.behaviors && res.data.behaviors[0] && res.data.behaviors[0].config && res.data.behaviors[0].config.target_temperature) {
                    dial.target_temperature = res.data.behaviors[0].config.target_temperature;
                }
            });

            $httpoll({
                url: '/api/devices/status/home_boiler',
                delay: 1000
                // TODO other params?
            })
            .then(function(res) {
                if (res.data && res.data.status && res.data.status.enabled) {
                    dial.hvac_state = 'heating';
                }
                else {
                    dial.hvac_state = 'off';
                }
            })
            .catch(function(res) {
                console.log(res);
            });

            $httpoll({
                url: '/api/sensors/reading/temp_core',
                delay: 1000
                // TODO other params?
            })
            .then(function(res) {
                if (res.data && res.data.type === 'temperature' && res.data.value) {
                    dial.ambient_temperature = res.data.value;
                }
                else {
                    dial.ambient_temperature = -1;
                }
            })
            .catch(function(res) {
                console.log(res);
            });
        }
    }
}]);
