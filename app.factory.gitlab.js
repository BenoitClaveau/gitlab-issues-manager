'use strict';

function main($resource, config) {

    return {
        issues: $resource(
            config.host + '/api/v4/issues?per_page=100',
            {},
            {
                query: {
                    method: 'GET',
                    isArray: true
                }
            }
        ),
        issues_time_stats: $resource(
            config.host + '/api/v4/projects/:id/issues/:issue_iid/time_stats?per_page=100',
            {},
            {
                get: {
                    method: 'GET'
                }
            }
        ),
        projects: $resource(
            config.host + '/api/v4/projects?per_page=100',
            {},
            {
                query: {
                    method: 'GET',
                    isArray: true
                }
            }
        ),
        projects_issues: $resource(
            config.host + '/api/v4/projects/:id/issues?per_page=100',
            {},
            {
                query: {
                    method: 'GET',
                    isArray: true
                }
            }
        ),
        projects_labels: $resource(
            config.host + '/api/v4/projects/:id/labels?per_page=100',
            {},
            {
                query: {
                    method: 'GET',
                    isArray: true
                }
            }
        ),
        projects_milestones: $resource(
            config.host + '/api/v4/projects/:id/milestones?per_page=100',
            {},
            {
                query: {
                    method: 'GET',
                    isArray: true
                }
            }
        )
    };
}

angular.module('IssuesManager').factory('gitlab', main);

