'use strict';

angular.module('app.pipeline-view')

.component('pipelineView', {
    templateUrl: 'pipelines/pipeline-view.template.html',
    bindings: {
        pipeline: '<',
        active: '='
    },
    controller: ['$scope', '$route', 'Pipelines', function PipelineViewController($scope, $route, Pipelines) {
        let ctrl = this;

        ctrl.editing = false;

        ctrl.$onInit = function() {
            // TODO
        };
        ctrl.$onChanges = function(changesObj) {
            // TODO
        };

        $scope.deleteBehavior = function(behavior) {
            // find the behavior in the pipeline and remove it
            let behaviorIdx = -1;
            ctrl.pipeline.behaviors.forEach(function(e, i) {
                if (e.id === behavior.id && e.order === behavior.order) {
                    behaviorIdx = i;
                }
            });

            if (behaviorIdx >= 0) {
                ctrl.pipeline.behaviors.splice(behaviorIdx, 1);
            }
        };

        $scope.beginEditMode = function() {
            ctrl.editing = true;
        };

        $scope.endEditMode = function() {
            // rebuild order
            ctrl.pipeline.behaviors.forEach(function(e, i) {
                e.order = (i+1) * 10;
            });

            // TODO error handling and loading spinner
            Pipelines.active_update(ctrl.pipeline).then(function() {
                $route.reload();
            });
        };

        $scope.commit = function() {
            Pipelines.update(ctrl.pipeline.id, ctrl.pipeline).then(function() {
                $route.reload();
            });
        };
    }]
});
