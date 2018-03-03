'use strict';

angular.module('app.behavior-view')

.component('behaviorView', {
    template: '<ng-include src="behaviorTemplateUrl"></ng-include>',
    bindings: {
        pipelineId: '=',
        behavior: '<'
    },
    controller: ['$scope', function BehaviorViewController($scope) {
        let ctrl = this;

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
                    case 'chrono.ForceTemperatureUntilBehavior':
                        templateName = 'force-until';
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
