'use strict';

angular.module('app.behavior-view')

.component('behaviorView', {
    template: '<ng-include src="behaviorTemplateUrl"></ng-include>',
    bindings: {
        behavior: '<'
    },
    controller: ['$scope', 'Pipelines', function BehaviorViewController($scope, Pipelines) {
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
            console.log(ctrl.behavior);
            Pipelines.active_set_config(ctrl.behavior.order, ctrl.behavior.config)
            .then(function(res) {
                callback(res);
            });
        };

        ctrl.$onInit = function() {
            // TODO
        };
        ctrl.$onChanges = function() {
            if (ctrl.behavior) {
                let templateName;
                switch (ctrl.behavior.id) {
                    case 'generic.ForceTemperatureBehavior':
                        templateName = 'force';
                        break;
                    case 'chrono.WeeklyProgramBehavior':
                        templateName = 'weekly';
                        break;
                    default:
                        templateName = 'default';
                }

                $scope.behaviorTemplateUrl = 'behaviors/behavior-view.template.' + templateName + '.html';
            }
        };
    }]
});
