'use strict';

angular.module('app.core.pipelines').
factory('Pipelines', ['$http',
    function($http) {
        return {
            active: function() {
                return $http({
                    url: '/api/pipelines/active',
                    method: 'GET'
                }).then(function(res) {
                    return res.data;
                });
            },

            active_update: function(data) {
                return $http({
                    url: '/api/pipelines/active',
                    method: 'PUT',
                    data: data
                });
            },

            active_set_config: function(order, data) {
                return $http({
                    url: '/api/pipelines/active/' + encodeURIComponent(order),
                    method: 'PUT',
                    data: data
                });
            },

            active_rollback: function() {
                return $http({
                    url: '/api/pipelines/active/rollback',
                    method: 'PUT'
                });
            },

            query: function() {
                return $http({
                    url: '/api/pipelines',
                    method: 'GET'
                }).then(function(res) {
                    return res.data;
                });
            },

            create: function(pipeline) {
                return $http({
                    url: '/api/pipelines',
                    method: 'POST',
                    data: pipeline
                }).then(function(res) {
                    return res.data;
                });
            },

            update: function(pipeline_id, data) {
                return $http({
                    url: '/api/pipelines/' + encodeURIComponent(pipeline_id),
                    method: 'PUT',
                    data: data
                });
            },

            set_config: function(pipeline_id, order, data) {
                return $http({
                    url: '/api/pipelines/' + encodeURIComponent(pipeline_id) + '/' + encodeURIComponent(order),
                    method: 'PUT',
                    data: data
                });
            },


        };
    }
]);
