var module = angular.module('fairModule');

module.controller('fairStandsCtrl', function ($scope, $state, $stateParams, liveFairApi, utils) {
    var liveFairID = $stateParams.fairID;
    $scope.fair = liveFairApi.getLiveFair(liveFairID);
    $scope.fairStands = liveFairApi.getLiveFairStands(liveFairID);

    $scope.loadProfile = function(id) {
        $state.go('menu.profile', {fairID: liveFairID, companyID: id});
    }

});

module.controller('fairProgramCtrl', function ($scope, $state, $stateParams, $ionicPopup, calendar, liveFairApi, _, schedule, utils) {

    var getEventsFromSameDateMillis = function(millis, events) {
        var date = new Date(millis);
        var eventsFromSameDate = [];
        var eventTimes = _.keys(events);
        for(var i = 0; i < eventTimes.length; i++) {
            var eventTime = eventTimes[i];
            var eventDate = new Date(eventTime);
            if(eventDate.getDate() == date.getDate() && eventDate.getMonth() == date.getMonth() && eventDate.getFullYear() == date.getFullYear()) {
                eventsFromSameDate.push({eventTime: eventTime, eventTimeEvents: events[eventTime]});
            }
        }
        return eventsFromSameDate;
    };

    $scope.days = {};

    $scope.failedToResolve = schedule == "failed to resolve";
    if($scope.failedToResolve)
        return;

    var liveFairID = $stateParams.fairID;
    $scope.fair = liveFairApi.getLiveFair(liveFairID);

    $scope.schedule = _.chain(schedule)
        .sortBy(function(event) {
            return event.startTime;
        })
        .groupBy(function(event) {
            return event.startTime;
        }).value();

    $scope.scheduleDays = _.chain(schedule)
        .sortBy(function(event) {
            return event.startTime;
        })
        .map(function(event) {
            var time = new Date(event.startTime);
            return (Date.parse(utils.getDayMonthYearDate(time)));
        })
        .unique()
        .value();

    $scope.scheduleOrganizedByDay = [];
    _.forEach($scope.scheduleDays, function(day) {
        return $scope.scheduleOrganizedByDay[day] = getEventsFromSameDateMillis(parseInt(day), $scope.schedule);
    });

    $scope.days.selectedDay = $scope.scheduleDays[0];

    $scope.loadEvent = function(fairName, event) {
        $scope.liveFairEvent = event;
        var myPopup = $ionicPopup.show({
            templateUrl: "eventPopup.html",
            title: fairName,
            scope: $scope,
            buttons: [
                {
                    text: '<b>Sync</b>',
                    type: 'button-balanced',
                    onTap: function(e) {
                        //Create event in phone's calendar
                        var eventNotes = fairName + " \nSpeakers: " + $scope.liveFairEvent.speakers;
                        calendar.createEventInteractively(fairName, $scope.liveFairEvent.subject, $scope.liveFairEvent.speakers, $scope.liveFairEvent.startTime, $scope.liveFairEvent.endTime);
                    }
                },
                {
                    text: '<b>Ok</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        console.log("tapped button");
                    }
                },
            ]
        });
    }

});

module.controller('listFairsCtrl', function ($scope, $state, $stateParams, utils, liveFairApi, $localForage) {

    $scope.listfairs = "";
    $scope.existingFairs = "";
    $scope.sortOption = 0;
    $scope.resolving = {};

    $scope.formatMonth = function() {
        for(i = 0; i < $scope.listfairs.length; i++) {
            $scope.listfairs[i].month = utils.getMonthName($scope.listfairs[i].month);
        }
    };

    $scope.loadFair = function(fairID){
        $state.go('menu.fair', {fairID: fairID}, {reload: true,inherit: false,notify: true});
    };

    $scope.loadFairs = function() {
        utils.showLoadingPopup();
        liveFairApi.getLiveFairs().$promise
            .then(function(liveFairs) {
                $localForage.setItem("liveFairs", liveFairs)
                    .then(function() {
                        $scope.listfairs = liveFairs;
                        $scope.existingFairs = liveFairs;
                        utils.hideLoadingPopup();
                        $scope.resolving.failedToResolve = false;
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            }, function(error) {
                $localForage.getItem("liveFairs")
                    .then(function(liveFairs) {
                        if(liveFairs) {
                            $scope.listfairs = liveFairs;
                            $scope.existingFairs = liveFairs;
                            utils.hideLoadingPopup();
                            $scope.resolving.failedToResolve = false;
                            $scope.$broadcast('scroll.refreshComplete');
                        }
                        else {
                            utils.hideLoadingPopup();
                            $scope.resolving.failedToResolve = true;
                            $scope.$broadcast('scroll.refreshComplete');
                        }
                    }, function(error) {
                        utils.hideLoadingPopup();
                        $scope.resolving.failedToResolve = true;
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            });
    };

    $scope.sortFairsByName = function () {

        if ($scope.sortOption === 1) {
            $scope.listfairs.reverse();
        } else {
            $scope.sortOption = 1;
            $scope.listfairs = _.sortBy($scope.listfairs, "name");
        }
    };

    $scope.sortFairsByDate = function () {

        if ($scope.sortOption === 2) {
            $scope.listfairs.reverse();
        } else {
            $scope.sortOption = 2;
            $scope.listfairs = _.sortBy($scope.listfairs, function (fair) {
                return fair.date;
            });
        }
    };

    $scope.resetSort = function() {
        $scope.listfairs = $scope.existingFairs;
        $scope.sortOption = 0;
    }
});

module.controller('fairCtrl', function($scope, $state, $stateParams, $ionicPopup, $translate, $localForage, utils, liveFairApi, calendar, server, $ionicScrollDelegate) {
    var liveFairID = $stateParams.fairID;
    $scope.days = {};
    $scope.hideMap = false;
    $scope.month = "";
    $scope.description = true;
    $scope.userType = "";
    $scope.participating = false;
    $scope.matches = "";
    $scope.mapSource = "";
    $scope.loggedIn = false;
    $scope.tabOption = 1;
    $scope.listfairs = "";
    $scope.sortOption = 0;
    $scope.resolving = {};

    $scope.toggleHideMap = function() {
        $scope.hideMap = true;
    };

    $scope.loadFairProfile = function() {
        // Load fair information
        utils.showLoadingPopup();
        liveFairApi.getLiveFair(liveFairID).$promise
            .then(function(liveFair){
                $localForage.setItem(liveFairID, liveFair).then(function() {
                    $scope.fair = liveFair;
                    $scope.resolving.failedToResolve = false;
                    utils.hideLoadingPopup();
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }, function(error) {
                $localForage.getItem(liveFairID).then(function(liveFair) {
                    if(liveFair) {
                        $scope.fair = liveFair;
                        $scope.resolving.failedToResolve = false;
                        utils.hideLoadingPopup();
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                    else {
                        $scope.resolving.failedToResolve = true;
                        utils.hideLoadingPopup();
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                }, function(error) {
                    $scope.resolving.failedToResolve = true;
                    utils.hideLoadingPopup();
                    $scope.$broadcast('scroll.refreshComplete');
                });
            });

        // Load fair stands
        utils.showLoadingPopup();
        liveFairApi.getLiveFairStands(liveFairID).$promise
            .then(function(stands) {
                $localForage.setItem(liveFairID + "_stands", stands).then(function() {
                    $scope.fairStands = stands;
                    fillImagePath();
                    $scope.resolving.failedToResolve = false;
                    utils.hideLoadingPopup();
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }, function(error) {
                $localForage.getItem(liveFairID + "_stands").then(function(stands){
                    if(stands) {
                        $scope.fairStands = stands;
                        fillImagePath();
                        $scope.resolving.failedToResolve = false;
                        utils.hideLoadingPopup();
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                    else {
                        $scope.resolving.failedToResolve = true;
                        utils.hideLoadingPopup();
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                }, function(error) {
                    $scope.resolving.failedToResolve = true;
                    utils.hideLoadingPopup();
                    $scope.$broadcast('scroll.refreshComplete');
                });
            });

        // Load fair program
        utils.showLoadingPopup();
        $scope.initializeProgram();

        // Load interests
        utils.showLoadingPopup();
        $localForage.getItem('isAuthenticated').then(function(response) {
                if(response == true) {
                    $scope.loggedIn = true;
                    liveFairApi.getLiveFairInterests(liveFairID).$promise.then(function(interests) {
                        $localForage.setItem(liveFairID + "_interests", interests).then(function() {
                            $scope.interestsList = interests;
                            $scope.resolving.failedToResolve = false;
                            utils.hideLoadingPopup();
                            $scope.$broadcast('scroll.refreshComplete');
                        });
                    }, function(error) {
                        $localForage.getItem(liveFairID + "_interests").then(function(interests) {
                            if(interests) {
                                $scope.interestsList = interests;
                                $scope.resolving.failedToResolve = false;
                                utils.hideLoadingPopup();
                                $scope.$broadcast('scroll.refreshComplete');
                            }
                            else {
                                $scope.resolving.failedToResolve = true;
                                utils.hideLoadingPopup();
                                $scope.$broadcast('scroll.refreshComplete');
                            }
                        }, function(error) {
                            $scope.resolving.failedToResolve = true;
                            utils.hideLoadingPopup();
                            $scope.$broadcast('scroll.refreshComplete');
                        });
                    });
                } else if(response == false) {
                    $scope.loggedIn = false;
                    utils.hideLoadingPopup();
                    $scope.$broadcast('scroll.refreshComplete');
                }
            }, function(response) {
                utils.hideLoadingPopup();
                $scope.$broadcast('scroll.refreshComplete');
            }
        );

        // Check if participating
        utils.showLoadingPopup();
        $localForage.getItem('userType').then(function(response) {
                $scope.userType = response;
                $localForage.getItem('userID').then(function(responseID) {
                        var userID = responseID;
                        if($scope.userType === 'company') {
                            liveFairApi.checkIfCompanyParticipatingFair(userID, liveFairID).then(function(data) {

                                if(data === "false") {
                                    $scope.participating = false;
                                }
                                else if(data === "true") {
                                    $scope.participating = true;
                                }

                                $scope.month = utils.getMonthName($scope.fair.month);
                                utils.hideLoadingPopup();
                                $scope.$broadcast('scroll.refreshComplete');
                            }, function(error) {
                                console.log(error);
                                $scope.participating = false;
                                utils.hideLoadingPopup();
                                $scope.$broadcast('scroll.refreshComplete');
                            });
                        } else if($scope.userType === 'visitor') {
                            liveFairApi.checkIfVisitorParticipatingFair(userID, liveFairID).then(function(data) {

                                if(data === "false") {
                                    $scope.participating = false;
                                }
                                else if(data === "true") {
                                    $scope.participating = true;
                                }

                                $scope.month = utils.getMonthName($scope.fair.month);
                                utils.hideLoadingPopup();
                                $scope.$broadcast('scroll.refreshComplete');
                            }, function(error) {
                                console.log(error);
                                $scope.participating = false;
                                utils.hideLoadingPopup();
                                $scope.$broadcast('scroll.refreshComplete');
                            });
                        }
                    }, function(response) {
                        utils.hideLoadingPopup();
                        $scope.$broadcast('scroll.refreshComplete');
                        utils.showAlert($translate.instant('sessionExpired'), "Error");
                        $state.go('menu.home');
                        liveFairApi.logout();
                    }
                );
            }, function(error) {
                utils.hideLoadingPopup();
                $scope.$broadcast('scroll.refreshComplete');
                utils.showAlert($translate.instant('sessionExpired'), "Error");
                $state.go('menu.home');
                liveFairApi.logout();
            }
        );
    };

    function fillImagePath() {
        $scope.mapSource = server.url + "/livefairs/" + liveFairID +"/map";
        for(i = 0; i < $scope.fairStands.length; i++) {
            $scope.fairStands[i].logoImagePath = server.url + "/Users/" + $scope.fairStands[i].companyID +"/image";
        }
    };

    $scope.chooseInterests = function() {
        var myPopup = $ionicPopup.show({
            templateUrl: "interestsPopup.html",
            title: 'Adesão',
            scope: $scope,
            buttons: [
                { text: $translate.instant('cancel') },
                {
                    text: '<b>' + $translate.instant('btnAderir') + '</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        var liveFairID = $stateParams.fairID;
                        $scope.interestsList = utils.getInterestsList();
                        var interestsIDS = [];
                        for(i = 0; i < $scope.interestsList.length; i++) {
                            if($scope.interestsList[i].checked)
                                interestsIDS.push($scope.interestsList[i].interestID);
                        }

                        $localForage.getItem('userID').then(function(response) {
                                liveFairApi.adhereLiveFair(liveFairID, response, interestsIDS).
                                    then(function(data) {
                                        utils.showAlert($translate.instant('successfulSubscribeLiveFair'), $translate.instant('success'));
                                        $scope.participating = true;
                                    }, function(error) {
                                        utils.showAlert($translate.instant('errorSubscribeLiveFair'), $translate.instant('error'));
                                    });
                            }, function(response) {
                                utils.showAlert($translate.instant('sessionExpired'), $translate.instant('error'));
                                $state.go('menu.home');
                                liveFairApi.logout();
                            }
                        );
                    }
                }
            ]
        });
    };

    $scope.cancelFairSubmission = function() {
        var userID = "";
        var confirmPopup = $ionicPopup.confirm({
            title: $translate.instant('confirm'),
            template: $translate.instant('confirmFairCancel')
        });
        confirmPopup.then(function(res) {
            if(res) {
                $localForage.getItem('userID').then(function(response) {
                        userID = response;
                        liveFairApi.cancelSubscription(liveFairID, userID).$promise
                            .then(function(liveFairs) {
                                $scope.participating = false;
                                utils.showAlert($translate.instant('pCancelarParticipacao'), $translate.instant('success'));
                            }, function(error) {
                                utils.showAlert($translate.instant('impCancelarParticipacao'), $translate.instant('error'));
                            }
                        );
                    }, function(response) {
                        utils.showAlert($translate.instant('sessionExpired'), $translate.instant('error'));
                        $state.go('menu.home');
                        liveFairApi.logout();
                    }
                );
            }
        });
    };

    $scope.getMatches = function(fairID) {
        utils.setFairName($scope.fair.name);
        $state.go('menu.matches', {fairID: fairID});
    };

    $scope.openStats = function(fairID) {
        $state.go('menu.companyStats', {fairID: fairID});
    }

    $scope.changedCheckbox = function() {
        console.log($scope.interestsList);
        for(i = 0; i < $scope.interestsList.length; i++) {
            if(! $scope.interestsList[i].checked)
                $scope.interestsList[i].checked = false;
        }
        utils.setInterestsList($scope.interestsList);
    };

    $scope.loadStands = function(fairID) {
        $state.go('menu.fairStands', {fairID: fairID});
    };

    $scope.loadEvents = function(fairID) {
        $state.go('menu.fairProgram', {fairID: fairID});
    };

    $scope.createStandEvent = function(fairID) {
        $localForage.getItem('userID').then(function(userID){
            $state.go('menu.createStandEvent', {fairID: fairID, companyID: userID});
        }, function(error) {
            $ionicPopup.alert({
                title: $translate.instant('cantCreateStandEventTitle'),
                template: '<p class="text-center">' + $translate.instant("cantCreateStandEventMessage") + '</p>'
            });
        });
    };

    $scope.showInfoPage = function(){
        $scope.tabOption = 1;
        $ionicScrollDelegate.resize();
    };

    $scope.showPresentStands = function(){
        $scope.tabOption = 2;
        $ionicScrollDelegate.resize();
    };

    $scope.showSuggestedStands = function(){
        $scope.tabOption = 3;
        $ionicScrollDelegate.resize();
    };

    $scope.loadProfile = function(id) {
        $state.go('menu.profile', {fairID: liveFairID, companyID: id});
    };

    var getEventsFromSameDateMillis = function(millis, events) {
        var date = new Date(millis);
        var eventsFromSameDate = [];
        var eventTimes = _.keys(events);
        for(var i = 0; i < eventTimes.length; i++) {
            var eventTime = eventTimes[i];
            var eventDate = new Date(eventTime);
            if(eventDate.getDate() == date.getDate() && eventDate.getMonth() == date.getMonth() && eventDate.getFullYear() == date.getFullYear()) {
                eventsFromSameDate.push({eventTime: eventTime, eventTimeEvents: events[eventTime]});
            }
        }
        return eventsFromSameDate;
    };

    $scope.loadProgram = function(unparsedProgram) {
        $scope.failedToResolve = (unparsedProgram == "failed to resolve");
        if ($scope.failedToResolve) {
            return;
        }

        $scope.schedule = _.chain(unparsedProgram)
            .sortBy(function(event) {
                return event.startTime;
            })
            .groupBy(function(event) {
                return event.startTime;
            }).value();

        $scope.scheduleDays = _.chain(unparsedProgram)
            .sortBy(function(event) {
                return event.startTime;
            })
            .map(function(event) {
                var time = new Date(event.startTime);
                return (Date.parse(utils.getDayMonthYearDate(time)));
            })
            .unique()
            .value();

        $scope.scheduleOrganizedByDay = [];
        _.forEach($scope.scheduleDays, function(day) {
            return $scope.scheduleOrganizedByDay[day] = getEventsFromSameDateMillis(parseInt(day), $scope.schedule);
        });

        $scope.days.selectedDay = $scope.scheduleDays[0];
    };

    $scope.initializeProgram = function() {
        liveFairApi.getLiveFairSchedule($stateParams.fairID).$promise
            .then(function(program) {
                $localForage.setItem("schedule_" + $stateParams.fairID, program)
                    .then(function() {
                        $scope.loadProgram(program);
                        $scope.resolving.failedToResolve = false;
                        utils.hideLoadingPopup();
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            }, function(error) {
                return $localForage.getItem("schedule_" + $stateParams.fairID)
                    .then(function(program) {
                        if(program) {
                            $scope.loadProgram(program);
                            $scope.resolving.failedToResolve = false;
                            utils.hideLoadingPopup();
                            $scope.$broadcast('scroll.refreshComplete');
                        }
                        else {
                            $scope.resolving.failedToResolve = true;
                            utils.hideLoadingPopup();
                            $scope.$broadcast('scroll.refreshComplete');
                        }
                    }, function(error) {
                        $scope.loadProgram("failed to resolve");
                        $scope.resolving.failedToResolve = true;
                        utils.hideLoadingPopup();
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            });
    };

    $scope.loadEvent = function(fairName, event) {
        $scope.liveFairEvent = event;
        var myPopup = $ionicPopup.show({
            templateUrl: "eventPopup.html",
            title: fairName,
            scope: $scope,
            buttons: [
                {
                    text: '<b>Sync</b>',
                    type: 'button-balanced',
                    onTap: function(e) {
                        //Create event in phone's calendar
                        var eventNotes = fairName + " \nSpeakers: " + $scope.liveFairEvent.speakers;
                        calendar.createEventInteractively(fairName, $scope.liveFairEvent.subject, $scope.liveFairEvent.speakers, $scope.liveFairEvent.startTime, $scope.liveFairEvent.endTime);
                    }
                },
                {
                    text: '<b>Ok</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        console.log("tapped button");
                    }
                },
            ]
        });
    };

    $scope.showOwnStandEvents = function(fairID) {
        $localForage.getItem('userID').then(function(userID) {
            if(!userID) {
                utils.showAlert($translate.instant('ownStandEventsProblem'), $translate.instant('error'));
            }
            else
                $state.go('menu.standProgram', {fairID: fairID, companyID: userID});
        }, function(error) {
            utils.showAlert($translate.instant('ownStandEventsProblem'), $translate.instant('error'));
        });
    };
});

module.controller('fairMatchesCtrl', function ($scope, $state, $stateParams, liveFairApi, utils, $translate, $localForage) {
    var liveFairID = $stateParams.fairID;
    $scope.stands = "";
    $scope.fairName = "";

    $localForage.getItem('userID').then(function(response) {
            var userID = response;
            liveFairApi.getMatches(liveFairID, userID).$promise.then(function(data) {
                console.log(data);
                $scope.stands = data;
                $scope.fairName = utils.getFairName();
            }, function(error) {
                utils.showAlert($translate.instant('notPossibleMatches'), $translate.instant('error'));
            });
        }, function(response) {
            utils.showAlert($translate.instant('sessionExpired'), $translate.instant('error'));
            $state.go('menu.home');
            liveFairApi.logout();
        }
    );

    $scope.loadProfile = function(id) {
        $state.go('menu.profile', {fairID: liveFairID, companyID: id});
    };
});


module.controller('searchFairCtrl', function ($scope, $state, $stateParams, $ionicPopup, utils, liveFairApi, $translate) {


    $scope.loadFairs = function() {
        utils.showLoadingPopup();
        liveFairApi.getLiveFairs().$promise
            .then(function(liveFairs) {
                $scope.listfairs = liveFairs;
                utils.hideLoadingPopup();
                $scope.failedToResolve = false;
            }, function(error) {
                utils.hideLoadingPopup();
                $scope.failedToResolve = true;
            });
    };

    $scope.startDate = "";
    $scope.endDate = "";
    $scope.searchName = "";
    $scope.searchLocation = "";

    $scope.minDateMoment = moment().add(-1, "years");
    $scope.minDate = $scope.minDateMoment.format("YYYY-MM-DD");
    $scope.maxDateMoment = moment().add(2, "years");
    $scope.maxDate = $scope.maxDateMoment.format("YYYY-MM-DD");

    $scope.existingFairs = liveFairApi.getLiveFairs();
    $scope.listfairs = $scope.existingFairs;
    $scope.sortOption = 0;

    $scope.filterByDate = function () {
        var myPopup = $ionicPopup.show({
            templateUrl: "templates/searchFairs-datePopUp.html",
            scope: $scope,
            buttons: [
                {
                    text: '<b>' + $translate.instant('clean') + '</b>',
                    onTap: function (e) { //lets clean date filters
                        $scope.listfairs = $scope.existingFairs;
                        $scope.startDate = "";
                        $scope.endDate = "";
                    }
                },
                {
                    text: '<b>Ok</b>',
                    type: 'button-positive',
                    onTap: function (e) { //lets filter this stuff
                        $scope.startDate = utils.getStartDate() || "";
                        $scope.endDate = utils.getEndDate() || "";
                        if($scope.startDate === "" || $scope.endDate === "") {
                            $scope.listfairs = $scope.existingFairs;
                            $scope.startDate = "";
                            $scope.endDate = "";
                            utils.setStartDate("");
                            utils.setEndDate("");
                            return;
                        }
                        var tempArray = [];
                        $scope.listfairs = $scope.existingFairs;
                        var startDateConverted = Number(new Date($scope.startDate));
                        var endDateConverted = Number(new Date($scope.endDate));
                        for (var i = 0; i < $scope.listfairs.length; i++) {
                            fairDate = $scope.listfairs[i].startDate.substring(0, 10);
                            fairDateConverted = Number(new Date(fairDate));
                            if (fairDateConverted >= startDateConverted && fairDateConverted <= endDateConverted) {
                                tempArray.push($scope.listfairs[i]);
                            }
                        }
                        $scope.listfairs = tempArray;
                        $scope.startDate = "";
                        $scope.endDate = "";
                        utils.setStartDate("");
                        utils.setEndDate("");
                    }
                }
            ]
        });
    };

    $scope.verifyDate = function () {
        var startDate = moment($scope.startDate);
        var endDate = moment($scope.endDate);

        if($scope.startDate !== "") {
            //if(startDate.isBefore($scope.minDateMoment)) {
            //    $scope.startDate = $scope.minDate;
            //}
            utils.setStartDate($scope.startDate);
        }
        else {
            utils.setStartDate("");
            $scope.startDate = "";
        }

        if ($scope.endDate !== "") {
            //if (endDate.isAfter($scope.maxDateMoment)) {
            //    $scope.endDate = $scope.maxDate;
            //}
            utils.setEndDate($scope.endDate);
        }
        else {
            utils.setEndDate("");
            $scope.endDate = "";
        }
    };

    $scope.loadFair = function (fairID) {
        $state.go('menu.fair', {fairID: fairID}, {reload: true,inherit: false,notify: true});
    };

    $scope.sortFairsByName = function () {

        if ($scope.sortOption === 1) {
            $scope.listfairs.reverse();
        } else {
            $scope.sortOption = 1;
            $scope.listfairs = _.sortBy($scope.listfairs, "name");
        }
    };

    $scope.sortFairsByDate = function () {

        if ($scope.sortOption === 2) {
            $scope.listfairs.reverse();
        } else {
            $scope.sortOption = 2;
            $scope.listfairs = _.sortBy($scope.listfairs, function (fair) {
                return fair.date;
            });
        }
    };

    $scope.resetSort = function() {
        $scope.listfairs = $scope.existingFairs;
        $scope.sortOption = 0;
    }
});

module.controller('standProgramCtrl', function ($scope, $state, $stateParams, $ionicPopup, calendar, liveFairApi, _, schedule, utils, $localForage) {
    $scope.companyID = $stateParams.companyID;
    $scope.scheduledEvents = schedule;
    $scope.showDelete = false;
    $scope.showDeleteButton = false;
    $scope.days = {};
    $scope.failedToResolve = false;
    $localForage.getItem('userID').then(function(userID) {
        if(userID === $scope.companyID) {
            $scope.showDeleteButton = true;
        }
    });

    var getEventsFromSameDateMillis = function(millis, events) {
        var date = new Date(millis);
        var eventsFromSameDate = [];
        var eventTimes = _.keys(events);
        for (var i = 0; i < eventTimes.length; i++) {
            var eventTime = eventTimes[i];
            var eventDate = new Date(eventTime);
            if (eventDate.getDate() == date.getDate() && eventDate.getMonth() == date.getMonth() && eventDate.getFullYear() == date.getFullYear()) {
                eventsFromSameDate.push({eventTime: eventTime, eventTimeEvents: events[eventTime]});
            }
        }
        return eventsFromSameDate;
    };

    $scope.reloadProgram = function() {
        $scope.failedToResolve = ($scope.scheduledEvents === "failed to resolve");
        if ($scope.failedToResolve) {
            return;
        }

        var companyID = $stateParams.companyID;
        liveFairApi.getProfile(companyID).$promise.then(function(profile) {
            $localForage.setItem("profile_" + companyID, profile).then(function() {
                $scope.companyName = profile[1].companyName;
                $scope.failedToResolve = false;
            });
        }, function(error) {
            $localForage.getItem("profile_" + companyID).then(function(profile) {
                if(profile) {
                    $scope.companyName = profile[1].companyName;
                }
                else {
                    $scope.failedToResolve = true;
                }
            }, function(error) {
                $scope.failedToResolve = true;
            });
        });

        var liveFairID = $stateParams.fairID;
        liveFairApi.getLiveFair(liveFairID).$promise
            .then(function(liveFair){
                $localForage.setItem(liveFairID, liveFair).then(function() {
                    $scope.fair = liveFair;
                    $scope.failedToResolve = false;
                });
            }, function(error) {
                $localForage.getItem(liveFairID).then(function(liveFair) {
                    if(liveFair) {
                        $scope.fair = liveFair;
                        $scope.failedToResolve = false;
                    }
                    else {
                        $scope.failedToResolve = true;
                    }
                }, function(error) {
                    $scope.failedToResolve = true;
                });
            });

        liveFairApi.getLiveFairStandSchedule($stateParams.fairID, $stateParams.companyID).$promise
            .then(function(program) {
                $localForage.setItem("schedule_" + $stateParams.fairID + "_" + $stateParams.companyID, program)
                    .then(function() {
                        $scope.loadProgram(program);
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            }, function(error) {
                $localForage.getItem("schedule_" + $stateParams.fairID + "_" + $stateParams.companyID)
                    .then(function(program) {
                        $scope.loadProgram(program);
                        $scope.$broadcast('scroll.refreshComplete');
                    }, function(error) {
                        $scope.loadProgram("failed to resolve");
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            });
    };

    $scope.loadProgram = function(unparsedProgram) {
        $scope.failedToResolve = (unparsedProgram == "failed to resolve");
        if ($scope.failedToResolve) {
            return;
        }

        $scope.schedule = _.chain(unparsedProgram)
            .sortBy(function (event) {
                return event.startTime;
            })
            .groupBy(function (event) {
                return event.startTime;
            }).value();

        $scope.scheduleDays = _.chain(unparsedProgram)
            .sortBy(function (event) {
                return event.startTime;
            })
            .map(function (event) {
                var time = new Date(event.startTime);
                return (Date.parse(utils.getDayMonthYearDate(time)));
            })
            .unique()
            .value();

        $scope.scheduleOrganizedByDay = [];
        _.forEach($scope.scheduleDays, function (day) {
            return $scope.scheduleOrganizedByDay[day] = getEventsFromSameDateMillis(parseInt(day), $scope.schedule);
        });

        $scope.days.selectedDay = $scope.scheduleDays[0];
    };

    $scope.reloadProgram();

    $scope.loadEvent = function (fairName, event) {
        $scope.liveFairCompanyEvent = event;

        var myPopup = $ionicPopup.show({
            templateUrl: "eventPopup.html",
            title: fairName,
            scope: $scope,
            buttons: [
                {
                    text: '<b>Sync</b>',
                    type: 'button-balanced',
                    onTap: function (e) {
                        //Create event in phone's calendar
                        var eventNotes = fairName + " \nSpeakers: " + $scope.liveFairCompanyEvent.speakers;
                        calendar.createEventInteractively(fairName, $scope.liveFairCompanyEvent.subject, $scope.liveFairCompanyEvent.speakers, $scope.liveFairCompanyEvent.startTime, $scope.liveFairCompanyEvent.endTime);
                    }
                },
                {
                    text: '<b>Ok</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        console.log("tapped button");
                    }
                }
            ]
        });
    };

    $scope.removeStandEvent = function(eventID) {
        liveFairApi.removeStandEvent($stateParams.fairID, $stateParams.companyID, eventID).$promise
            .then(function() {
                $scope.scheduledEvents = _.filter($scope.scheduledEvents, function(event) {
                    return event.companyEventsID !== eventID;
                });

                $scope.schedule = _.chain($scope.scheduledEvents)
                    .sortBy(function (event) {
                        return event.startTime;
                    })
                    .groupBy(function (event) {
                        return event.startTime;
                    }).value();

                $scope.scheduleDays = _.chain($scope.scheduledEvents)
                    .sortBy(function (event) {
                        return event.startTime;
                    })
                    .map(function (event) {
                        var time = new Date(event.startTime);
                        return (Date.parse(utils.getDayMonthYearDate(time)));
                    })
                    .unique()
                    .value();

                $scope.scheduleOrganizedByDay = [];
                _.forEach($scope.scheduleDays, function (day) {
                    return $scope.scheduleOrganizedByDay[day] = getEventsFromSameDateMillis(parseInt(day), $scope.schedule);
                });

                $scope.days.selectedDay = $scope.scheduleDays[0];

                $localForage.setItem("schedule_" + $stateParams.fairID + "_" + $stateParams.companyID, $scope.scheduledEvents);

            }, function(error) {
                $ionicPopup.alert({
                    title: $translate.instant('cantRemoveStandEventTitle'),
                    template: '<p class="text-center">' + $translate.instant("cantRemoveStandEventMessage") + '</p>'
                });
            });
    }
});

module.controller('createStandEventCtrl', function ($scope, $state, $stateParams, $ionicPopup, calendar, liveFairApi, $translate, $ionicLoading) {
    $scope.eventInfo = {};
    $scope.eventInfo.subject = "";
    $scope.eventInfo.speakers = "";
    $scope.eventInfo.location = "";
    $scope.eventInfo.startDate = "";
    $scope.eventInfo.startTime = "";
    $scope.eventInfo.endDate = "";
    $scope.eventInfo.endTime = "";

    $scope.createEvent = function() {
        var startTime = moment($scope.eventInfo.startDate + " " + $scope.eventInfo.startTime, "YYYY-MM-DD HH:mm");
        var endTime = moment($scope.eventInfo.endDate + " " + $scope.eventInfo.endTime, "YYYY-MM-DD HH:mm");

        $ionicLoading.show({
            template: $translate.instant('processingPopup')
        });
        liveFairApi.createStandEvent($stateParams.fairID, $stateParams.companyID, $scope.eventInfo.subject, $scope.eventInfo.speakers, $scope.eventInfo.location, startTime, endTime)
            .then(function(result) {
                if(result) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: $translate.instant('successfulEventCreationTitle'),
                        template: '<p class="text-center">' + $translate.instant("successfulEventCreationMessage") + '</p>'
                    });
                    $state.go('menu.fair', {fairID: $stateParams.fairID});
                }
                else {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: $translate.instant('unsuccessfulEventCreationTitle'),
                        template: '<p class="text-center">' + $translate.instant("unsuccessfulEventCreationMessage") + '</p>'
                    });
                }
            });
    }
});
