'use strict';

angular.module('app.dashboard', ['ngRoute', 'ngHTTPPoll', 'app.core.pipelines', 'app.core.devices', 'app.core.sensors'])

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

.factory('dashboardStatusService', ['$timeout', 'Pipelines', 'Devices', 'Sensors',
function ($timeout, Pipelines, Devices, Sensors) {
    let sensorPoll = null;
    let devicePoll = null;

    return {
        // FIXME hard-coding all the way!!!

        pollStatus: function(controller, dial) {

            let getDeviceStatus = function() {
                const deviceStatus = Devices.status({id: activePipeline.params.target_device}, function() {
                    if (deviceStatus.status && deviceStatus.status.enabled) {
                        dial.hvac_state = 'heating';
                    }
                    else {
                        dial.hvac_state = 'off';
                    }

                    if (devicePoll)
                        $timeout.cancel(devicePoll);
                    devicePoll = $timeout(getDeviceStatus, 2000);
                });
            };

            // target temperature and device from active pipeline
            const activePipeline = Pipelines.active(function() {
                dial.target_temperature = activePipeline.params.target_temperature;

                // start polling device status
                getDeviceStatus();
            });

            // use the first sensor only
            // TODO we should make an average of all sensors
            const sensors = Sensors.query(function() {
                let getSensorReading = function() {
                    const reading = Sensors.reading({id: sensors[0].id}, function() {
                        dial.ambient_temperature = reading.value;
                    });

                    if (sensorPoll)
                        $timeout.cancel(sensorPoll);
                    sensorPoll = $timeout(getSensorReading, 2000);
                };

                // start polling sensors
                getSensorReading();
            });

            // destroy polls on controller exit
            controller.$on('$destroy', function() {
                if (devicePoll)
                    $timeout.cancel(devicePoll);
                if (sensorPoll)
                    $timeout.cancel(sensorPoll);
            });
        }
    }
}]);
