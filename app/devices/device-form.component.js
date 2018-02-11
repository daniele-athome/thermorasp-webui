'use strict';

angular.module('app.devices')

.component('deviceForm', {
    templateUrl: 'devices/device-form.template.html',
    bindings: {
        update: '=',
        onSave: '&'
    },
    controller: function DeviceFormController($scope) {
        let ctrl = this;

        // default values
        $scope.device = {
            'protocol': 'local',
            'type': 'boiler_on_off'
        };

        ctrl.$onInit = function() {
            // TODO
        };
        ctrl.$onChanges = function() {
            // TODO
        };
        ctrl.save = function(device) {
            ctrl.onSave({device: device});
        }
    }
});
