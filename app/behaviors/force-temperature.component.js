'use strict';

angular.module('app.behavior-view')

.component('forceTemperatureBehavior', {
    templateUrl: 'behaviors/force-temperature.template.html',
    bindings: {
        behavior: '<'
    },
    controller: ['$scope', 'Pipelines', function ForceTemperatureBehaviorController($scope, Pipelines) {
        let ctrl = this;

        $scope.successInputGroup = function(buttonId) {
            return function() {
                angular.element(document.getElementById(buttonId))
                    .removeClass('btn-outline-secondary')
                    .addClass('btn-success')
                    .find('i')
                    .removeClass('fa-save')
                    .addClass('fa-check');
            };
        };

        $scope.restoreInputGroup = function(buttonId) {
            angular.element(document.getElementById(buttonId))
                .removeClass('btn-success')
                .addClass('btn-outline-secondary')
                .find('i')
                .removeClass('fa-check')
                .addClass('fa-save');
        };

        $scope.save = function(callback) {
            Pipelines.active_set_config(ctrl.behavior.order, ctrl.behavior.config)
                .then(function(res) {
                    callback(res);
                });
        };
    }]
});
