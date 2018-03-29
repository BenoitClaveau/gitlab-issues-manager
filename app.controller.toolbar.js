'use strict';

function main($rootScope, $scope, $mdSidenav, config) {
    $scope.private = config.private_token != null;
    
    $scope.logout = function () {
        localStorage.removeItem('access_token');
        localStorage.removeItem('private_token');
        location.href = config.web;
    };

    $scope.toggleRightSidenav = function () {
        $rootScope.right_sidenav_locked_open = !$rootScope.right_sidenav_locked_open;
        $scope.showMe = !$scope.showMe;
    };

    $rootScope.right_sidenav_locked_open = true
}

angular.module('IssuesManager').controller('ToolbarController', main);

