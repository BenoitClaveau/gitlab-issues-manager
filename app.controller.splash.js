'use strict';

function main($scope, auth, config) {

    $scope.$watch('authRequired', function () {
        window.addEventListener('load', function () {
            setTimeout(function () {
                if ($scope.authRequired) {
                    auth.redirectToOauth();
                } else {
                    $("#loader").fadeOut("slow");
                }
            }, 2000);
        });
    });

    if (config.private_token) $scope.authRequired = false;
    else if (localStorage.getItem('access_token')) $scope.authRequired = false;
    else $scope.authRequired = true;

}

angular.module('IssuesManager').controller('SplashController', main);

