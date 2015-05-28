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

    $scope.selectedDay = $scope.scheduleDays[0];

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

module.controller('listFairsCtrl', function ($scope, $state, $stateParams, utils, liveFairApi) {

    $scope.listfairs = "";

    $scope.formatMonth = function() {
        for(i = 0; i < $scope.listfairs.length; i++) {
            $scope.listfairs[i].month = utils.getMonthName($scope.listfairs[i].month);
        }
    };

    $scope.loadFair = function(fairID){
        $state.go('menu.fair', {fairID: fairID});
    }

    $scope.loadFairs = function() {
        utils.showLoadingPopup();
        liveFairApi.getLiveFairs().$promise
            .then(function(liveFairs) {
                console.log(liveFairs);
                $scope.listfairs = liveFairs;
                utils.hideLoadingPopup();
                $scope.failedToResolve = false;
            }, function(error) {
                utils.hideLoadingPopup();
                $scope.failedToResolve = true;
            });
    }
});


module.controller('fairCtrl', function($scope, $state, $stateParams, $ionicPopup, $translate, $localForage, utils, liveFairApi) {
    var liveFairID = $stateParams.fairID;
    $scope.fair = liveFairApi.getLiveFair(liveFairID);
    $scope.hideMap = false;
    $scope.month = "";
    $scope.description = true;
    $scope.interestsList = liveFairApi.getLiveFairInterests(liveFairID);
    $scope.userType = "";
    $scope.participating = false;

    $scope.toggleHideMap = function() {
        $scope.hideMap = true;
    };

    $scope.loadFairProfile = function() {
        $localForage.getItem('userType').then(function(response) {
                $scope.userType = response;
                $localForage.getItem('userID').then(function(responseID) {
                        var userID = responseID;
                        if($scope.userType === 'company') {
                            liveFairApi.checkIfCompanyParticipatingFair(userID, liveFairID).then(function(data) {
                                    console.log(data);
                                    $scope.participating = data;
                                    $scope.month = utils.getMonthName($scope.fair.month);
                                    //
                                    //$scope.participating = true;
                                }, function(error) {
                                    console.log(error);
                                    $scope.participating = false;
                            });
                        } else if($scope.userType === 'visitor') { ///CHANGE
                            liveFairApi.checkIfCompanyParticipatingFair(userID, liveFairID).then(function(data) {
                                    console.log(data);
                                    $scope.participating = data;
                                    $scope.month = utils.getMonthName($scope.fair.month);
                                    //
                                    //$scope.participating = true;                                    
                                }, function(error) {
                                    console.log(error);
                                    $scope.participating = false;
                            });
                        }
                    }, function(response) {
                        utils.showAlert($translate.instant('sessionExpired'), "Error");
                        $state.go('menu.home');
                        liveFairApi.logout();
                    }
                );
            }, function(response) {
                utils.showAlert($translate.instant('sessionExpired'), "Error");
                $state.go('menu.home');
                liveFairApi.logout();
            }
        );
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
                                console.log("Isto devia dar uma vez");
                                liveFairApi.adhereLiveFair(liveFairID, response, interestsIDS).
                                    then(function(data) {
                                        utils.showAlert(data, "Sucesso");
                                        //fazer reload ao screen para quem esta a participar
                                        $scope.participating = true;
                                    }, function(error) {
                                        utils.showAlert($translate.instant('erroSubscribeLiveFair'), "Erro");
                                });
                            }, function(response) {
                                utils.showAlert($translate.instant('sessionExpired'), "Error");
                                $state.go('menu.home');
                                liveFairApi.logout();
                            }
                        );
                    }
                }
            ]
        });
    };

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
});

module.controller('searchFairCtrl', function ($scope, $state, $stateParams, $ionicPopup, utils, liveFairApi, $translate) {

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
                            fairDate = $scope.listfairs[i].date.substring(0, 10);
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
        $state.go('menu.fair', {fairID: fairID});
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

module.controller('standProgramCtrl', function ($scope, $state, $stateParams, $ionicPopup, calendar, liveFairApi, _, schedule, utils) {
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

    $scope.failedToResolve = (schedule == "failed to resolve");
    if ($scope.failedToResolve) {
        return;
    }

    var companyID = $stateParams.companyID;
    liveFairApi.getProfile(companyID).$promise.then(function(profile) {
        $scope.companyName = profile[1].companyName;
    });

    var liveFairID = $stateParams.fairID;
    $scope.fair = liveFairApi.getLiveFair(liveFairID);

    $scope.schedule = _.chain(schedule)
        .sortBy(function (event) {
            return event.time;
        })
        .groupBy(function (event) {
            return event.time;
        }).value();

    $scope.scheduleDays = _.chain(schedule)
        .sortBy(function (event) {
            return event.time;
        })
        .map(function (event) {
            var time = new Date(event.time);
            return (Date.parse(utils.getDayMonthYearDate(time)));
        })
        .unique()
        .value();

    $scope.scheduleOrganizedByDay = [];
    _.forEach($scope.scheduleDays, function (day) {
        return $scope.scheduleOrganizedByDay[day] = getEventsFromSameDateMillis(parseInt(day), $scope.schedule);
    });

    $scope.selectedDay = $scope.scheduleDays[0];

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
                        calendar.createEventInteractively(fairName, $scope.liveFairCompanyEvent.Subject, $scope.liveFairCompanyEvent.speakers, $scope.liveFairCompanyEvent.time, $scope.liveFairCompanyEvent.endTime);
                    }
                },
                {
                    text: '<b>Ok</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        console.log("tapped button");
                    }
                },
            ]
        });
    }
});

module.controller('createStandEventCtrl', function ($scope, $state, $stateParams, $ionicPopup, calendar, liveFairApi, utils, $localForage) {
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

        var result = liveFairApi.createStandEvent($stateParams.fairID, $stateParams.companyID, $scope.eventInfo.subject, $scope.eventInfo.speakers, $scope.eventInfo.location, startTime, endTime);
        console.log(result);
    }
});
