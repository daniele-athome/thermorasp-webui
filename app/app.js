'use strict';

// Declare app level module which depends on views, and components
angular.module('app', [
    'ngRoute',
    'pascalprecht.translate',
    'ngFlash',
    'ui.bootstrap',
    'angularSpinners',
    'dndLists',
    'app.core',
    'app.dashboard',
    'app.devices',
    'app.sensors',
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

    const registerServiceWorker = function() {
        navigator.serviceWorker.register('sw.js', {scope: '/'})
            .then(function (registration) {
                // do we need to do something here?
                // printing some debug stuff in the meantime we decide
                let serviceWorker;
                if (registration.installing) {
                    serviceWorker = registration.installing;
                }
                else if (registration.waiting) {
                    serviceWorker = registration.waiting;
                }
                else if (registration.active) {
                    serviceWorker = registration.active;
                }

                if (serviceWorker) {
                    console.log("ServiceWorker phase:", serviceWorker.state);

                    serviceWorker.addEventListener('statechange', function (e) {
                        console.log("ServiceWorker phase:", e.target.state);
                    });
                }
            })
            .catch(function (err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    };

    if ('serviceWorker' in navigator) {
        registerServiceWorker();
    } else {
        console.log("this browser does NOT support service worker");
    }
}]);
