'use strict';

angular.module('app.core.pipelines').
factory('Pipelines', ['$resource',
    function($resource) {
        return $resource('/api/pipelines', {}, {
            active: {
                method: 'GET',
                url: '/api/pipelines/active',
                isArray: false
            },
            active_update: {
                method: 'PUT',
                url: '/api/pipelines/active'
            },
            query: {
                method: 'GET',
                isArray: true
            }
        });
    }
]);
