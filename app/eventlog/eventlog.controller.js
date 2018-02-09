'use strict';

angular.module('app.eventlog')

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/eventlog', {
        templateUrl: 'eventlog/eventlog.template.html',
        controller: 'EventLogCtrl'
    });
}])

.controller('EventLogCtrl', ['$scope', 'EventLog', function($scope, EventLog) {

    $scope.goNext = function() {
        if ($scope.events.length > 0) {
            const startId = $scope.events[$scope.events.length - 1].id;
            EventLog.next(startId).then(function (data) {
                if (data.length > 0)
                    $scope.events = data;
            });
        }
    };

    $scope.goPrev = function() {
        if ($scope.events.length > 0) {
            const startId = $scope.events[0].id;
            EventLog.prev(startId).then(function (data) {
                if (data.length > 0)
                    $scope.events = data;
            });
        }
    };

    EventLog.next().then(function(data) {
        $scope.events = data;
    });
}])

.filter('log_level_to_bootstrap', function() {
    return function(input) {
        switch (input) {
            case 'info':
                return 'info';
            case 'warning':
                return 'warning';
            case 'error':
                return 'danger';
            case 'danger':
                // custom class
                return 'blood';
        }
    };
});
