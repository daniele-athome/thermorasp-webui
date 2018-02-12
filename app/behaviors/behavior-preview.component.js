'use strict';

angular.module('app.behavior-view')

.component('behaviorPreview', {
    templateUrl: 'behaviors/behavior-preview.template.html',
    bindings: {
        behavior: '<'
    },
    controller: ['$scope', function BehaviorPreviewController($scope) {
        let ctrl = this;

        ctrl.$onInit = function() {
            // TODO
        };
        ctrl.$onChanges = function() {
            if (ctrl.behavior) {
                // TODO
            }
        };
    }]
});
