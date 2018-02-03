'use strict';

angular.module('app.core.devices').
factory('Devices', ['$resource',
    function($resource) {
        return $resource('/api/devices?type=:deviceType', {}, {
            boilers: {
                method: 'GET',
                params: {deviceType: 'boiler_on_off'},
                isArray: true
            }
        });
    }
]);
