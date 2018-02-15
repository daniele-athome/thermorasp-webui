'use strict';

angular.module('app.behavior-view')

.component('behaviorPreview', {
    templateUrl: 'behaviors/behavior-preview.template.html',
    bindings: {
        behavior: '<',
        onDelete: '&'
    },
    controller: ['$scope', function BehaviorPreviewController($scope) {
        let ctrl = this;

        $scope.deleteSelf = function() {
            ctrl.onDelete(ctrl.behavior);
        };

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
