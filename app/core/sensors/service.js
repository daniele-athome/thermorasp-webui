'use strict';

angular.module('app.core.sensors').
factory('Sensors', ['$resource',
    function($resource) {
        return $resource('/api/sensors', {}, {
            query: {
                method: 'GET',
                isArray: true
            },
            reading: {
                method: 'GET',
                url: '/api/sensors/reading/:id',
                isArray: false
            }
        });
    }
]);
