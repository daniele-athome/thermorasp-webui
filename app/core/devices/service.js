'use strict';

angular.module('app.core.devices').
factory('Devices', ['$resource',
    function($resource) {
        return $resource('/api/devices', {}, {
            query: {
                method: 'GET',
                isArray: true
            }
        });
    }
]);
