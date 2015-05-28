var module = angular.module('starter');

var timeout = 5000;

module.factory('liveFairApi', function($rootScope, $resource, $http, $q, server, $localStorage, $localForage, $ionicPopup, $translate, $ionicLoading) {
    var LiveFair = $resource(server.url + '/livefairs/:liveFairID', {liveFairID:'@liveFairID'});

    var LiveFairInterests = $resource(server.url + '/livefairs/:liveFairID/interests', {liveFairID:'@liveFairID'});

    var Stands = $resource(server.url + '/livefairs/:liveFairID/companies', {liveFairID: '@liveFairID'});

    var StandSchedule = $resource(server.url + '/livefairs/:liveFairID/companies/:companyID/events', {liveFairID: '@liveFairID', companyID: '@companyID'});

    var Schedule = $resource(server.url + '/livefairs/:liveFairID/schedule', {liveFairID: '@liveFairID'});

    var IncrementCounter = $resource(server.url + '/Users/:companyID/counter', {companyID: '@companyID'});

    var Profile = $resource(server.url + '/Users/:id', {id : '@id'});

    var ProfileInterests = $resource(server.url + '/livefairs/:fairID/companies/:companyID', {fairID: '@fairID', companyID: '@companyID'});

    var Matches = $resource(server.url + 'livefairs/:fairID/companies/:userID/matches', {fairID: '@fairID', userID: '@userID'});

    var api = {

        login: function(username, password) {
            $http.post(server.url + '/login', { username: username, password: password }, { ignoreAuthModule: true })
                .success(function (data, status, headers, config) {

                    // Remove stuff that may have been left
                    var promises = [];
                    promises.push($localForage.removeItem('token'));
                    promises.push($localForage.removeItem('userID'));
                    promises.push($localForage.removeItem('userEmail'));
                    promises.push($localForage.removeItem('userType'));
                    promises.push($localForage.setItem('isAuthenticated', false));
                    $q.all(promises).then(function() {
                        $localStorage.remove('token');
                        $rootScope.isAuthenticated = false;
                        $rootScope.userEmail = "";
                        $rootScope.userType = "";
                        delete $http.defaults.headers.common.Authorization;
                    });

                    // Add the new user info
                    $http.defaults.headers.common.Authorization = "Bearer " + data.token;
                    promises = [];
                    promises.push($localForage.setItem('token', data.token));
                    promises.push($localForage.setItem('userID', data.userID));
                    promises.push($localForage.setItem('userEmail', data.email));
                    promises.push($localForage.setItem('userType', data.type));
                    promises.push($localForage.setItem('isAuthenticated', true));
                    $q.all(promises).then(function() {
                        $localStorage.set('token', data.token);
                        $rootScope.isAuthenticated = true;
                        $rootScope.userEmail = data.email;
                        $rootScope.userType = data.type;
                        $rootScope.$broadcast('event:auth-loginConfirmed');
                    });

                    //$localStorage.set('token', data.token);
                    //$localStorage.set('userID', data.userID);
                    //$localStorage.set('userEmail', data.email);
                    //$localStorage.set('userType', data.type);

                    //$rootScope.$broadcast('event:auth-loginConfirmed');
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
            var promises = [];
            $rootScope.userType = "";
            promises.push($localForage.removeItem('token'));
            promises.push($localForage.removeItem('userID'));
            promises.push($localForage.removeItem('userEmail'));
            promises.push($localForage.removeItem('userType'));
            promises.push($localForage.setItem('isAuthenticated', false));
            $q.all(promises).then(function() {
                $localStorage.remove('token');
                $rootScope.isAuthenticated = false;
                $rootScope.userEmail = "";
                $rootScope.userType = "";
                $rootScope.$broadcast('event:auth-logout-complete');

                $ionicPopup.alert({
                    title: $translate.instant('loggedOutPopupTitle'),
                    template: '<p class="text-center">' + $translate.instant("loggedOutPopupMessage") + '</p>'
                });
            });

            delete $http.defaults.headers.common.Authorization;

            //$http.post('http://logout', {}, { ignoreAuthModule: true })
            //    .finally(function(data) {
            //        var promises = [];
            //        promises.push($localForage.removeItem('token'));
            //        promises.push($localForage.removeItem('userID'));
            //        promises.push($localForage.removeItem('userEmail'));
            //        promises.push($localForage.removeItem('userType'));
            //        promises.push($localForage.setItem('isAuthenticated', false));
            //        $q.all(promises).then(function() {
            //            $rootScope.isAuthenticated = false;
            //            $rootScope.$broadcast('event:auth-logout-complete');
            //        });
            //
            //        delete $http.defaults.headers.common.Authorization;
            //
            //        //$localStorage.remove('token');
            //        //$localStorage.remove('userID');
            //        //$localStorage.remove('userEmail');
            //        //$localStorage.remove('userType');
            //        //
            //        //delete $http.defaults.headers.common.Authorization;
            //        //$rootScope.$broadcast('event:auth-logout-complete');
            //    });
        },
        //loginCancelled: function() {
        //    authService.loginCancelled();
        //},
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
        getLiveFairStandSchedule: function(fairID, companyID) {
            return StandSchedule.query({liveFairID: fairID, companyID: companyID});
        },
        getLiveFairSchedule: function(fairID) {
            return Schedule.query({liveFairID: fairID});
        },
        getProfile: function(userID) {
            return Profile.query({id: userID});
        },

        getCompanyInterests: function(fairId, companyId) {
            return ProfileInterests.query({fairID: fairId, companyID: companyId});
        },

        getMatches: function(fairId, userId) {
            return Matches.query({fairID: fairId, userID: userId});
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

        checkIfVisitorParticipatingFair: function(userId, fairId) {
            return $http.get(server.url + '/livefairs/' + fairId + "/" + userId + '/participating', {timeout: timeout})
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

        checkIfCompanyParticipatingFair:  function(companyId, fairId) {
            return $http.get(server.url + '/livefairs/' + fairId + "/" + companyId + '/standParticipating', {timeout: timeout})
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

        adhereLiveFair: function(fairID, userID, interestsList) {
            return $http.post(server.url + '/livefairs/' + fairID + '/interests/' + userID + '/submit', {interests: interestsList}, {timeout: timeout})
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

        changePassword: function(userID, oldPasswordToSend, newPassword) {
            return $http.post(server.url + '/Users/' + userID + '/update/password', {password: newPassword, oldPassword: oldPasswordToSend}, {timeout: timeout})
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
            return $http.post(server.url + '/register', {email: emailToSend, password: passwordToSend, type: typeToSend, address: addressToSend, companyName: companyNameToSend, website: websiteToSend}, {timeout: timeout})
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
        },

        createStandEvent: function(liveFairID, companyID, subject, speakers, location, startTime, endTime) {
            var deferred = $q.defer();
            $http.post(server.url + '/livefairs/' + liveFairID + "/companies/" + companyID + "/addStandEvent", {location: location, startTime: startTime, endTime: endTime, speakers: speakers, subject: subject}, {timeout: timeout})
                .then(function(response) {
                    if(response.status === 200) {
                        $ionicLoading.hide();
                        deferred.resolve(true);
                    } else {
                        deferred.resolve(false);
                    }
                }, function(response) {
                    deferred.resolve(false);
                }
            );
            return deferred.promise;
        }
    };

    return api;
});