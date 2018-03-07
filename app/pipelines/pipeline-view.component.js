'use strict';

angular.module('app.pipeline-view')

.component('pipelineView', {
    templateUrl: 'pipelines/pipeline-view.template.html',
    bindings: {
        pipeline: '<',
        active: '='
    },
    controller: ['$scope', '$route', '$uibModal', 'Pipelines', 'Behaviors',
    function PipelineViewController($scope, $route, $uibModal, Pipelines, Behaviors) {
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
                if (behaviorId) {
                    // request configuration schema to behavior
                    Behaviors.find(behaviorId).then(function(data) {
                        let config = {};

                        angular.forEach(data.config, function(value, key) {
                            // FIXME hard-coding stuff

                            if (key === 'mode') {
                                config.mode = 'heating';
                            }
                            else if (key === 'target_device_id') {
                                config.target_device_id = 'home_boiler';
                            }
                            else if (key === 'target_temperature') {
                                config.target_temperature = 20;
                            }
                            else if (key === 'time') {
                                config.time = '23:59';
                            }
                            else {
                                config[key] = '';
                            }
                        });

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
                            config: config
                        });
                    });
                }
            });
        };

        $scope.commit = function() {
            Pipelines.update(ctrl.pipeline.id, ctrl.pipeline).then(function() {
                $route.reload();
            });
        };
    }]
});
