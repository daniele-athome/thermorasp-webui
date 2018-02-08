'use strict';

angular.module('app.core.sensors').
factory('Sensors', ['$http',
    function($http) {
        return {
            query: function() {
                return $http({
                    url: '/api/sensors',
                    method: 'GET'
                });
            },
            reading: function(sensor_id) {
                return $http({
                    url: '/api/sensors/reading/:id',
                    params: {
                        'id': sensor_id
                    },
                    method: 'GET'
                });
            },
            reading_by_type: function(sensor_type) {
                return $http({
                    url: '/api/sensors/reading',
                    params: {
                        'sensor_type': sensor_type
                    },
                    method: 'GET'
                });
            }
        };
    }
]);
