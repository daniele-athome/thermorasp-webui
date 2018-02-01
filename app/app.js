'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.dashboard'
]).
config(['$locationProvider', '$routeProvider', '$httpProvider', function($locationProvider, $routeProvider, $httpProvider) {
    $locationProvider.hashPrefix('!');

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
}]);
