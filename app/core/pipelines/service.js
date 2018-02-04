'use strict';

angular.module('app.core.pipelines').
factory('Pipelines', ['$http',
    function($http) {
        return {
            active: function() {
                return $http({
                    url: '/api/pipelines/active',
                    method: 'GET'
                })
            },

            active_update: function(data) {
                return $http({
                    url: '/api/pipelines/active',
                    method: 'PUT',
                    data: data
                });
            },

            query: function() {
                return $http({
                    url: '/api/pipelines',
                    method: 'GET'
                })
            }
        };
    }
]);
