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


module.controller('fairCtrl', function($scope, $state, $stateParams, $ionicPopup, utils, liveFairApi,$translate) {

    var liveFairID = $stateParams.fairID;
    $scope.fair = liveFairApi.getLiveFair(liveFairID);
    $scope.hideMap = false;
    $scope.month = "";
    $scope.description = true;
    $scope.interestsList = liveFairApi.getLiveFairInterests(liveFairID);

    $scope.toggleHideMap = function() {
        $scope.hideMap = true;
    };

    $scope.loadFairProfile = function() {
        $scope.month = utils.getMonthName($scope.fair.month);
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
                        $scope.interestsList = utils.getInterestsList();
                        for(i = 0; i < $scope.interestsList.length; i++) {
                            console.log($scope.interestsList[i].checked);
                        }
                        console.log("tapped submit button");
                    }
                }
            ]
        });
    };

    $scope.changedCheckbox = function() {
        console.log("Interest List");
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
    }

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
    //    $scope.existingFairs = liveFairApi.getLiveFairs();
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
    console.log(schedule);
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
        console.log($scope.companyName);
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

    console.log($scope.schedule);

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
