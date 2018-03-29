'use strict';

function main($rootScope, $scope, $mdSidenav, gitlab, auth, config) {

    $scope.$watch('project', function () {
        $scope.labels = null;
        $scope.milestone = null;
        $scope.state = null;
        localStorage.removeItem('labels');
        localStorage.removeItem('milestone');
        localStorage.removeItem('state');

        if ($scope.project) {
            $scope.loadProjectLabels();
            $scope.loadProjectMilestones();
        }
    });

    $rootScope.$watch('show_comulative_time_estimate', function () {
        console.log($rootScope.show_comulative_time_estimate);
    });

    $scope.$watch('labels', function () {
        if ($scope.labels) {
        }
    });

    $scope.$watch('state', function () {
        if ($scope.state) {
        }
    });

    $scope.$watch('milestone', function () {
        if ($scope.milestone) {
        }
    });

    $scope.loadProjects = function () {
        var params = {
            membership: true
        }
        if (config.private_token) params.private_token = config.private_token;
        if (localStorage.getItem('access_token')) params.access_token = localStorage.getItem('access_token');
        
        $scope.projects = gitlab.projects.query(
            params, 
            function(res) {
                if (config.projectId == null) return;
                $scope.staticProject = true;
                $scope.project = res.find(function(e) { return e.id == config.projectId})
                $scope.applyFilter();
            }
        );
    };

    $scope.loadProjectLabels = function () {
        if (!$scope.project) {
            return;
        }

        var params = {
            id: $scope.project.id
        }
        if (config.private_token) params.private_token = config.private_token;
        if (localStorage.getItem('access_token')) params.access_token = localStorage.getItem('access_token');
        
        $scope.project_labels = gitlab.projects_labels.query(
            params, 
            function(res) {
                if (config.label == null) return;
                $scope.staticLabel = true;
                $scope.project = res.find(function(e) { return e.name == config.label}) //ADDED 1 == gitlab id
                $scope.applyFilter();
            }
        );
    };

    $scope.loadProjectMilestones = function () {
        if (!$scope.project) {
            return;
        }

        var params = {
            id: $scope.project.id
        }
        if (config.private_token) params.private_token = config.private_token;
        if (localStorage.getItem('access_token')) params.access_token = localStorage.getItem('access_token');
        

        $scope.project_milestones = gitlab.projects_milestones.query(
            params, 
            function(res) {
                if (config.milestone == null) return;
                $scope.staticMilestone = true;
                $scope.project = res.find(function(e) { return e.title == config.milestone}) //ADDED 1 == gitlab id
                $scope.applyFilter();
            }
        );
    };

    $scope.applyFilter = function () {
        if (!angular.isObject($scope.project)) {
            return;
        }

        localStorage.setItem('project_id', $scope.project.id);

        if ($scope.state) {
            localStorage.setItem('state', $scope.state);
        }
        if (angular.isObject($scope.milestone)) {
            localStorage.setItem('milestone', $scope.milestone.title);
        }
        if (angular.isObject($scope.labels)) {
            var l = [];
            angular.forEach($scope.labels, function (item) {
                l.push(item.name);
            });
            localStorage.setItem('labels', l.join(','));
        }

        $rootScope.$broadcast('local-storage-updated');
    };

    $rootScope.show_comulative_time_estimate = true;
    $rootScope.show_comulative_time_spent = true;
    $rootScope.show_show_logo_print = true;
    $rootScope.table_columns = [
        'iid',
        'title',
        'created_at',
        'author',
        'assignee',
        'time_estimate',
        'total_time_spent'
    ];
    $scope.loadProjects();
}

angular.module('IssuesManager').controller('FilterController', main);

