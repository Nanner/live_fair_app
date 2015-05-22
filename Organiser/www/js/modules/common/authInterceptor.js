var module = angular.module('starter');

module.factory('authInterceptor', function ($location, $rootScope, $q, $localStorage) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            var token = $localStorage.get('token');
            if (token) {
                config.headers.Authorization = 'Bearer ' + token;
            }
            return config;
        },
        response: function (response) {
            if (response.status === 401) {
                $location.url('menu.login');
            }
            return response || $q.when(response);
        }
    };
});