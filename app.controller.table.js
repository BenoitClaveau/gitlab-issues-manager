'use strict';

function main($rootScope, $scope, gitlab, config) {

    $rootScope.$on('local-storage-updated', function () {
        $scope.comulative_time_spent = 0;
        $scope.comulative_time_estimate = 0;
        $scope.loadIssues();
    });

    $scope.loadIssues = function () {
        var params = {};
        if (config.private_token) {
            params.private_token = config.private_token;
        } else if (localStorage.getItem('access_token')) {
            params.access_token = localStorage.getItem('access_token');
        } else {
            return;
        }
        if (localStorage.getItem('project_id')) {
            params.id = localStorage.getItem('project_id');
        } else {
            return;
        }
        if (localStorage.getItem('state')) {
            params.state = localStorage.getItem('state');
        }
        if (localStorage.getItem('milestone')) {
            params.milestone = localStorage.getItem('milestone');
        }
        if (localStorage.getItem('labels')) {
            params.labels = localStorage.getItem('labels');
        }
        $scope.issues = gitlab.projects_issues.query(
            params,
            function () {
            },
            function () {
                auth.redirectToOauth();
            }
        );
    };

    $scope.getIssuesTimeStats = function (issue_project_id, issue_iid) {
        var params = {
            id: issue_project_id,
            issue_iid: issue_iid
        }
        if (config.private_token) params.private_token = config.private_token;
        if (localStorage.getItem('access_token')) params.access_token = localStorage.getItem('access_token');
            
        return gitlab.issues_time_stats.get(
            params,
            function (res) {
                res.percent_time_spent = percent(res.time_estimate, res.total_time_spent);
                $scope.comulative_time_estimate += res.time_estimate;
                $scope.comulative_time_spent += res.total_time_spent;
                $scope.comulative_time_todo = $scope.comulative_time_estimate - $scope.comulative_time_spent;
                $scope.comulative_percent_time_spent = percent($scope.comulative_time_estimate, $scope.comulative_time_spent);
                $scope.comulative_human_time_estimate = transform(human($scope.comulative_time_estimate));
                $scope.comulative_human_time_spent = transform(human($scope.comulative_time_spent));
                $scope.comulative_human_time_todo = transform(human($scope.comulative_time_todo));
                res.human_time_estimate = transform(human(res.time_estimate));
                res.human_total_time_spent = transform(human(res.total_time_spent));
            }
        );
    };
}

function percent(estimate, spent) {
    if (!spent) return 0;
    return Math.round(spent / estimate * 100);
}

function human (time) {
    var str = "";
    if (time > 144000) str += Math.floor(time / 144000) + "w ";
    if (time > 28800) str += Math.floor((time % 144000) / 28800) + "d ";
    if (time > 3600) str += Math.floor(((time % 144000) % 28800) / 3600) + "h ";
    return str;    
}

function transform (text) {
    return text.replace(/(^0|\s0)(w|d|h)/, "")
        .replace(/(\d+)m\b/, "$1 minutes")
        .replace(/(\d+)d\b/, "$1 jours")
        .replace(/(\d+)h\b/, "$1 heures")
        .replace(/(\d+)w\b/, "$1 semaines")
        .replace(/\b1 semaines\b/, "1 semaine")
        .replace(/\b0 semaines\b/, "")
        .replace(/\b1 jours\b/, "1 jour")
        .replace(/\b0 jours\b/, "")
        .replace(/\b1 heures\b/, "1 heure")
        .replace(/\b0 heures\b/, "")
        .replace(/\b1 minutes\b/, "1 miniute")
        .replace(/\b0 minutes\b/, "");
}

angular.module('IssuesManager').controller('TableController', main);

