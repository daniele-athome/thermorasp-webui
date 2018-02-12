'use strict';

angular.module('app.pipeline-view')

.component('pipelineView', {
    templateUrl: 'pipelines/pipeline-view.template.html',
    bindings: {
        pipeline: '<'
    },
    controller: ['$scope', function PipelineViewController($scope) {
        let ctrl = this;

        ctrl.editing = false;

        ctrl.$onInit = function() {
            // TODO
        };
        ctrl.$onChanges = function(changesObj) {
            // TODO
        };

        $scope.beginEdit = function() {
            ctrl.editing = true;
        };
    }]
});
