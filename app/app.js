'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
    'ngRoute',
    'pascalprecht.translate',
    'app.core',
    'app.dashboard',
    'app.devices',
    'app.pipelines'
]).
config(['$locationProvider', '$routeProvider', '$httpProvider', '$translateProvider',
    function($locationProvider, $routeProvider, $httpProvider, $translateProvider) {
        $locationProvider.hashPrefix('!');

        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });
        $translateProvider
            .useSanitizeValueStrategy('escapeParameters')
            // FIXME hard-coded language
            .preferredLanguage('it_IT');

        /** TODO for when we'll have login
        $httpProvider.interceptors.push(function($q, dependency1, dependency2) {
            return {
                'request': function(config) {
                    return config;
                },

                'response': function(response) {
                    // TODO
                    return response;
                }
            };
        });
         */

        $routeProvider.otherwise({redirectTo: '/dashboard'});
    }
]);
