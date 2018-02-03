'use strict';

angular.module('app.dashboard', ['ngRoute', 'ngHTTPPoll'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/dashboard', {
        templateUrl: 'dashboard/dashboard.html',
        controller: 'DashboardCtrl'
    });
}])

.controller('DashboardCtrl', ['$scope', '$timeout', 'dashboardStatusService', function($scope, $timeout, dashboardStatusService) {
    $scope.thermostatDial = new thermostatDial(document.getElementById('dashboard-thermostat'), {
        onSetTargetTemperature: function (targetTemperature) {
            // TODO alter pipeline
            console.log(targetTemperature);
        }
    });

    dashboardStatusService.pollStatus($scope, $scope.thermostatDial);
}])

.factory('dashboardStatusService', ['$http', '$httpoll', function ($http, $httpoll) {
    return {
        // FIXME hard-coding all the way!!!

        pollStatus: function(controller, dial) {
            // target temperature from active pipeline
            $http({
               url: '/api/pipelines/active'
            })
            .then(function(res) {
                if (res.data && res.data.behaviors && res.data.behaviors[0] && res.data.behaviors[0].config && res.data.behaviors[0].config.target_temperature) {
                    dial.target_temperature = res.data.behaviors[0].config.target_temperature;
                }
            })
            .catch(function(res) {
                console.log(res);
            });

            $httpoll({
                url: '/api/devices/status/home_boiler',
                delay: 2000,
                until: function(response, config, state, actions) {
                    if (!controller.$$destroyed) {
                        if (response.data && response.data.status && response.data.status.enabled) {
                            dial.hvac_state = 'heating';
                        }
                        else {
                            dial.hvac_state = 'off';
                        }
                    }
                    return controller.$$destroyed;
                }
                // TODO other params?
            });

            $httpoll({
                url: '/api/sensors/reading/temp_core',
                delay: 30000,
                until: function(response, config, state, actions) {
                    if (!controller.$$destroyed) {
                        if (response.data && response.data.type === 'temperature' && response.data.value) {
                            dial.ambient_temperature = response.data.value;
                        }
                        else {
                            // FIXME hard-coded
                            dial.ambient_temperature = 10;
                        }
                    }
                    return controller.$$destroyed;
                }
                // TODO other params?
            });
        }
    }
}]);
