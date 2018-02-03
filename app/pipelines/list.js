'use strict';

angular.module('app.pipelines')

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/pipelines/list', {
        templateUrl: 'pipelines/list.html',
        controller: 'PipelinesListCtrl'
    });
}])

.controller('PipelinesListCtrl', ['$scope', 'Pipelines', function($scope, Pipelines) {
    // TODO
    $scope.active = Pipelines.active();
    $scope.pipelines = Pipelines.query();
}]);
