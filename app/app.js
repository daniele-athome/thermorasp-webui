'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
    'ngRoute',
    'pascalprecht.translate',
    'ngFlash',
    'ui.bootstrap',
    'angularSpinners',
    'app.core',
    'app.dashboard',
    'app.devices',
    'app.pipelines',
    'app.pipeline-view',
    'app.behavior-view',
    'app.eventlog'
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
        // FIXME hard-coded locale
        moment.locale('it');

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
])
.run(['$rootScope', 'Flash', function($rootScope, Flash) {
    $rootScope.$on('$locationChangeStart', function(event, next, current) {
        // FIXME works, but clears any flash set by previous page
        Flash.clear();
    });
}]);
