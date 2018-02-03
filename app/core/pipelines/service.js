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
            query: {
                method: 'GET',
                isArray: true
            }
        });
    }
]);
