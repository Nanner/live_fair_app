var module = angular.module('starter');

var timeout = 5000;

module.factory('liveFairApi', function($rootScope, $resource, $http, $q, server, authService, $localStorage, $state, utils) {
    var LiveFair = $resource(server.url + '/livefairs/:liveFairID', {liveFairID:'@liveFairID'});

    var LiveFairInterests = $resource(server.url + '/livefairs/:liveFairID/interests', {liveFairID:'@liveFairID'});

    var Stands = $resource(server.url + '/livefairs/:liveFairID/companies', {liveFairID: '@liveFairID'});

    var Schedule = $resource(server.url + '/livefairs/:liveFairID/schedule', {liveFairID: '@liveFairID'});

    var IncrementCounter = $resource(server.url + '/Users/:companyID/counter', {companyID: '@companyID'});

    var Profile = $resource(server.url + '/Users/:id', {id : '@id'});

    var api = {

        login: function(username, password) {
            $http.post(server.url + '/login', { username: username, password: password }, { ignoreAuthModule: true })
                .success(function (data, status, headers, config) {

                    console.log("Bearer " + data.token);
                    $http.defaults.headers.common.Authorization = "Bearer " + data.token;  // Step 1
                    $localStorage.set('token', data.token);
                    $localStorage.set('userID', data.userID);
                    $localStorage.set('userEmail', data.email);
                    $localStorage.set('userType', data.type);
                    $rootScope.showProfile = data.type == "company";

                    $rootScope.$broadcast('event:auth-loginConfirmed');
                    //
                    //// Need to inform the http-auth-interceptor that
                    //// the user has logged in successfully.  To do this, we pass in a function that
                    //// will configure the request headers with the authorization token so
                    //// previously failed requests(aka with status == 401) will be resent with the
                    //// authorization token placed in the header
                    //authService.loginConfirmed(data, function(config) {  // Step 2 & 3
                    //    config.headers.Authorization = "Bearer " + data.authorizationToken;
                    //    $localStorage.set('authorizationToken', data.authorizationToken);
                    //    $localStorage.set('userID', data.userID);
                    //    $localStorage.set('userEmail', data.email);
                    //    $localStorage.set('userType', data.type);
                    //    console.log("lol");
                    //    console.log($localStorage.get('userID'));
                    //    return config;
                    //});
                })
                .error(function (data, status, headers, config) {
                    $rootScope.$broadcast('event:auth-login-failed', status);
                });
        },
        logout: function() {
            $http.post('https://logout', {}, { ignoreAuthModule: true })
                .finally(function(data) {
                    $localStorage.remove('token');
                    $localStorage.remove('userID');
                    $localStorage.remove('userEmail');
                    $localStorage.remove('userType');
                    $rootScope.showProfile = false;

                    delete $http.defaults.headers.common.Authorization;
                    $rootScope.$broadcast('event:auth-logout-complete');
                });
        },
        loginCancelled: function() {
            authService.loginCancelled();
        },
        getLiveFairs: function() {
            return LiveFair.query();
        },
        getLiveFair: function(fairID) {
            return LiveFair.get({liveFairID: fairID});
        },
        getLiveFairInterests: function(fairID) {
            return LiveFairInterests.query({liveFairID: fairID});
        },
        getLiveFairStands: function(fairID) {
            return Stands.query({liveFairID: fairID});
        },
        getLiveFairSchedule: function(fairID) {
            return Schedule.query({liveFairID: fairID});
        },

        getProfile: function(userID) {
            return Profile.query({id: userID});
        },

        editProfile: function(userID, name, descritionToSend, contactToSend, addressToSend, emailToSend, websiteToSend) {
            return $http.post(server.url + '/Users/' + userID + '/update', {companyName: name, email: emailToSend, address: addressToSend, contact: contactToSend, website: websiteToSend, description: descritionToSend}, {timeout: timeout})
            .then(function(response) {
                if(response.status === 200) {
                    return response.data;
                } else {
                    return $q.reject(response.data);
                }
            }, function(response) {
                    return $q.reject(response.data);
                }
            );
        },

        register: function(emailToSend, passwordToSend, typeToSend, addressToSend, companyNameToSend, websiteToSend) {
            return $http.post(server.url + '/register', {email: emailToSend, password: passwordToSend, type: typeToSend, address: addressToSend, compayName: companyNameToSend, website: websiteToSend}, {timeout: timeout})
            .then(function(response) {
                if(response.status === 200) {
                    return response.data;
                } else {
                    return $q.reject(response.data);
                }
            }, function(response) {
                    return $q.reject(response.data);
                }
            );
        },

        incrementCounter: function(companyId) {
            return IncrementCounter.save({companyID: companyId});
        }
    };

    return api;
});