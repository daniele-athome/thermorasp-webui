'use strict';

angular.module('app.pipeline-view')

.component('pipelineView', {
    templateUrl: 'pipelines/pipeline-view.template.html',
    bindings: {
        pipeline: '<',
        active: '='
    },
    controller: ['$scope', '$route', '$uibModal', 'Pipelines', function PipelineViewController($scope, $route, $uibModal, Pipelines) {
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

        $scope.addBehavior = function() {
            // open a popup to choose the behavior type
            const modal = $uibModal.open({
                animation: false,
                backdropClass: 'show',
                templateUrl: 'behaviors/behavior-type.modal.html',
                controllerAs: '$ctrl',
                controller: function($uibModalInstance) {
                    const ctrl = this;

                    ctrl.behaviorId = null;

                    ctrl.ok = function() {
                        $uibModalInstance.close(ctrl.behaviorId);
                    };

                    ctrl.cancel = function() {
                        $uibModalInstance.dismiss('cancel');
                    };
                }
            });

            modal.result.then(function(behaviorId) {
                let lastOrder;
                if (ctrl.pipeline.behaviors.length > 0) {
                    lastOrder = ctrl.pipeline.behaviors[ctrl.pipeline.behaviors.length - 1].order + 10;
                }
                else {
                    lastOrder = 10;
                }
                ctrl.pipeline.behaviors.push({
                    id: behaviorId,
                    order: lastOrder,
                    // TODO maybe a default configuration?
                    config: {}
                });
            });
        };

        $scope.commit = function() {
            Pipelines.update(ctrl.pipeline.id, ctrl.pipeline).then(function() {
                $route.reload();
            });
        };
    }]
});
