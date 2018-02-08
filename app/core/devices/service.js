'use strict';

angular.module('app.core.devices').
factory('Devices', ['$http',
    function($http) {
        return {
            boilers: function() {
                return $http({
                    method: 'GET',
                    url: '/api/devices',
                    params: {
                        type: 'boiler_on_off'
                    }
                });
            },
            status: function(device_id) {
                return $http({
                    method: 'GET',
                    url: '/api/devices/status/' + encodeURIComponent(device_id),
                    params: {
                        'id': device_id
                    }
                });
            }
        };
    }
]);
