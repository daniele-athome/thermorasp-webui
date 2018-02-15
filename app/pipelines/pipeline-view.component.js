'use strict';

angular.module('app.pipeline-view')

.component('pipelineView', {
    templateUrl: 'pipelines/pipeline-view.template.html',
    bindings: {
        pipeline: '<'
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

        $scope.switchEditMode = function() {
            if (ctrl.editing) {
                // rebuild order
                ctrl.pipeline.behaviors.forEach(function(e, i) {
                    e.order = (i+1) * 10;
                });

                // TODO error handling and loading spinner
                Pipelines.active_update(ctrl.pipeline).then(function() {
                    $route.reload();
                });
            }
            else {
                ctrl.editing = true;
            }
        };
    }]
});
