'use strict';

angular.module('app.pipelines')

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/pipelines/list', {
        templateUrl: 'pipelines/list.html',
        controller: 'PipelinesListCtrl'
    });
}])

.controller('PipelinesListCtrl', ['$scope', 'Pipelines', function($scope, Pipelines) {
    Pipelines.active().then(function(data) {
        $scope.active = data;
    });
    Pipelines.query().then(function(data) {
        $scope.pipelines = data;
    });
}]);
