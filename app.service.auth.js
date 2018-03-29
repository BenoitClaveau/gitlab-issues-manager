'use strict';

function main(config) {

    return {
        getAccessToken: function () {
            return localStorage.getItem('access_token');
        },
        redirectToOauth: function () {
            var client_id = config.oauth_client_id;
            var redirect_uri = encodeURI(config.oauth_callback);
            var authorize_url = config.host + "/oauth/authorize?&client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&scope=api&response_type=token&state=1";
            location.href = authorize_url;
        }

    };
}

angular.module('IssuesManager').service('auth', main);

