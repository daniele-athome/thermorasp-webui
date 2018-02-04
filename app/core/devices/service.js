'use strict';

angular.module('app.core.devices').
factory('Devices', ['$resource',
    function($resource) {
        return $resource('/api/devices', {}, {
            boilers: {
                method: 'GET',
                url: '/api/devices?type=:deviceType',
                params: {deviceType: 'boiler_on_off'},
                isArray: true
            },
            status: {
                method: 'GET',
                url: '/api/devices/status/:id',
                isArray: false
            }
        });
    }
]);
