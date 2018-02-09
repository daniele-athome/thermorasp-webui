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
