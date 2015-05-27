var module = angular.module('starter');

module.factory('authInterceptor', function ($location, $rootScope, $q, $localStorage, $localForage) {
    return {
        //request: function (config) {
        //    config.headers = config.headers || {};
        //    $localForage.getItem('token').then(function(t) {
        //        config.headers.Authorization = 'Bearer ' + t;
        //    });
        //    //var token = $localStorage.get('token');
        //    //console.log("Headers: " + config.headers);
        //    //if (token) {
        //    //    config.headers.Authorization = 'Bearer ' + token;
        //    //}
        //    return config;
        //},
        response: function (response) {
            if (response.status === 401) {
                $location.url('menu.login');
            }
            return response || $q.when(response);
        }
    };
});