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
                }).then(function(res) {
                    return res.data;
                });
            },
            status: function(device_id) {
                return $http({
                    method: 'GET',
                    url: '/api/devices/status/' + encodeURIComponent(device_id),
                    params: {
                        'id': device_id
                    }
                }).then(function(res) {
                    return res.data;
                });
            },
            register: function(device) {
                return $http({
                    method: 'POST',
                    url: '/api/devices/register',
                    data: device
                }).then(function(res) {
                    return res.data;
                });
            }
        };
    }
]);
