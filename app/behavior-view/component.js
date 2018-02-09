'use strict';

angular.module('app.behavior-view')

.component('behaviorView', {
    template: '<ng-include src="behaviorTemplateUrl"></ng-include>',
    bindings: {
        behavior: '<'
    },
    controller: function BehaviorViewController($scope) {
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
                    case 'chrono.WeeklyProgramBehavior':
                        templateName = 'weekly';
                        break;
                    default:
                        templateName = 'default';
                }

                $scope.behaviorTemplateUrl = 'behavior-view/template.' + templateName + '.html';
            }
        };
    }
});
