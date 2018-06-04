'use strict';

angular.module('app.sensors')

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/sensors/list', {
        templateUrl: 'sensors/sensor-list.template.html',
        controller: 'SensorsListCtrl'
    });
}])

.controller('SensorsListCtrl', ['$scope', 'Sensors', function($scope, Sensors) {
    Sensors.query().then(function(data) {
        $scope.sensors = data;
        Sensors.reading_by_type('temperature').then(function(data) {
            let readings = {};
            angular.forEach(data, function(s) {
                readings[s['sensor_id']] = s;
            });
            $scope.temp_readings = readings;
        });
    });
}]);
