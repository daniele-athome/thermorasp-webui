'use strict';

angular.module('app.dashboard')

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/dashboard', {
        templateUrl: 'dashboard/dashboard.template.html',
        controller: 'DashboardCtrl'
    });
}])

.controller('DashboardCtrl', ['$scope', '$location', '$timeout', 'Flash', 'Pipelines', 'dashboardStatusService',
function($scope, $location, $timeout, Flash, Pipelines, dashboardStatusService) {
    $scope.rollbackActivePipeline = function() {
        dashboardStatusService.rollback();
    };

    $scope.thermostatDial = new thermostatDial(document.getElementById('dashboard-thermostat'), {
        onSetTargetTemperature: function (targetTemperature) {
            if ($scope.activePipeline) {
                // retrieve top-most behavior in pipeline (lesser order)
                let lastOrder = -1;
                let firstBehavior = null;
                $scope.activePipeline.behaviors.forEach(function (e) {
                    if (lastOrder < 0 || e.order < lastOrder) {
                        lastOrder = e.order;
                        firstBehavior = e;
                    }
                });

                if (firstBehavior.id === 'chrono.ForceTemperatureUntilBehavior') {
                    // we already have a force temperature in the front of the chain
                    firstBehavior.config.target_temperature = targetTemperature;
                }
                else {
                    // put a force temperature in the front of the chain
                    $scope.activePipeline.behaviors.unshift({
                        'id': 'chrono.ForceTemperatureUntilBehavior',
                        'order': 1,
                        'config': {
                            'target_temperature': targetTemperature,
                            'mode': 'heating',
                            'target_device_id': $scope.activePipeline.params.target_device,
                            // TODO now +4 hours or 23:59
                            'time': '23:59'
                        },
                    });
                }

                Pipelines.active_update({behaviors: $scope.activePipeline.behaviors});
            }
            else {
                // TODO not possible, we should have been redirected to the pipelines page
            }
        }
    });

    dashboardStatusService.init($scope, $scope.thermostatDial);
    dashboardStatusService.pollStatus({
        ready: function() {
            $scope.showDashboard = true;
            $timeout(function() {
                $scope.dashboardVisible = true;
            }, 100);
        },

        noActivePipeline: function() {
            // send user to pipeline list page (with a flash alert)
            $location.path('/pipelines');
            $timeout(function() {
                // TODO i18n
                Flash.create('warning', 'No active pipeline. Please activate one.');
            }, 100);
        },

        activePipelineError: function() {
            // send user to pipeline list page (with a flash alert)
            $location.path('/pipelines');
            $timeout(function() {
                // TODO i18n
                Flash.create('danger', 'Active pipeline is not configured for correct use.');
            }, 100);
        }
    });

}])

.factory('dashboardStatusService', ['$timeout', 'Pipelines', 'Devices', 'Sensors',
function ($timeout, Pipelines, Devices, Sensors) {
    let sensorPoll = null;
    let devicePoll = null;
    let activePipeline = null;

    // passed from caller
    let controller = null;
    let dial = null;

    const _cancelPolls = function() {
        if (devicePoll)
            $timeout.cancel(devicePoll);
        if (sensorPoll)
            $timeout.cancel(sensorPoll);
    };

    const _pollStatus = function(callback) {
        let getDeviceStatus = function() {
            Devices.status(activePipeline.params.target_device).then(function(data) {
                if (data.status && data.status.enabled) {
                    dial.hvac_state = 'heating';
                }
                else {
                    dial.hvac_state = 'off';
                }

                if (devicePoll)
                    $timeout.cancel(devicePoll);
                devicePoll = $timeout(getDeviceStatus, 1500);
            });
        };

        // target temperature and device from active pipeline
        Pipelines.active().then(function(data) {
            activePipeline = data;
            // save the active pipeline to the scope
            controller.activePipeline = activePipeline;

            if (activePipeline.params && activePipeline.params.target_temperature && activePipeline.params.target_device) {
                dial.target_temperature = activePipeline.params.target_temperature;

                // start polling device status
                getDeviceStatus();
                // start polling sensors
                getSensorReading();

                callback.ready();
            }
            else {
                // no behavior in active pipeline or pipeline misconfiguration
                callback.activePipelineError();
            }
        })
        .catch(function(err) {
            if (err.status === 404) {
                // no active pipeline
                callback.noActivePipeline();
            }
            else {
                // TODO unexpected error
            }
        });

        // average temperature
        let getSensorReading = function() {
            Sensors.reading_by_type('temperature').then(function(data) {
                let total = 0;
                data.forEach(function(e) {
                    total += parseFloat(e.value);
                });
                dial.ambient_temperature = total / data.length;
            });

            if (sensorPoll)
                $timeout.cancel(sensorPoll);
            sensorPoll = $timeout(getSensorReading, 1500);
        };

        // destroy polls on controller exit
        controller.$on('$destroy', function() {
            _cancelPolls();
        });
    };

    return {
        // FIXME hard-coding all the way!!!

        init: function(_controller, _dial) {
            controller = _controller;
            dial = _dial;
        },

        rollback: function() {
            Pipelines.active_rollback().then(function() {
                _cancelPolls();
                _pollStatus();
            });
        },

        pollStatus: function(callback) {
            _pollStatus(callback);
        }
    }
}]);
