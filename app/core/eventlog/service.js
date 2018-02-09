'use strict';

angular.module('app.core.eventlog').
factory('EventLog', ['$http',
    function($http) {
        return {
            next: function(start_id, page_size) {
                return $http({
                    url: '/api/eventlog/next',
                    params: {
                        'start_id': start_id,
                        'page_size': page_size
                    },
                    method: 'GET'
                }).then(function(res) {
                    return res.data;
                });
            },
            prev: function(start_id, page_size) {
                return $http({
                    url: '/api/eventlog/prev',
                    params: {
                        'start_id': start_id,
                        'page_size': page_size
                    },
                    method: 'GET'
                }).then(function(res) {
                    return res.data;
                });
            }
        };
    }
]);
