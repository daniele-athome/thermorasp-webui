'use strict';

angular.module('app.core.behaviors').
factory('Behaviors', ['$http',
    function($http) {
        return {
            query: function() {
                return $http({
                    url: '/api/behaviors',
                    method: 'GET'
                }).then(function(res) {
                    return res.data;
                });
            },

            find: function(behavior_id) {
                return $http({
                    url: '/api/behaviors/' + encodeURIComponent(behavior_id),
                    method: 'GET'
                }).then(function(res) {
                    return res.data;
                });
            }
        };
    }
]);
