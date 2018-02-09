'use strict';

angular.module('app.pipeline-view')

.component('pipelineView', {
    templateUrl: 'pipelines/pipeline-view.template.html',
    bindings: {
        pipeline: '<'
    },
    controller: function PipelineViewController() {
        let ctrl = this;

        ctrl.$onInit = function() {
            // TODO
        };
        ctrl.$onChanges = function(changesObj) {
            // TODO
        };
    }
});
