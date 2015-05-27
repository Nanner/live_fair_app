var module = angular.module('fairModule');

module.controller('fairStandsCtrl', function ($scope, $state, $stateParams, liveFairApi) {
    var liveFairID = $stateParams.fairID;
    $scope.fair = liveFairApi.getLiveFair(liveFairID);
    $scope.fairStands = liveFairApi.getLiveFairStands(liveFairID);


    //$scope.fairStands = {name: "FEUP CARRER FAIR", stands: [{id: 1, stand: "AMT Consulting", standNumber: 15, logo: "img/Amt consulting.png"},{id: 2, stand: "AMT Consulting", standNumber: 15, logo: "img/Amt consulting.png"},{id: 3, stand: "AMT Consulting", standNumber: 15, logo: "img/Amt consulting.png"}]};

    $scope.loadProfile = function(id) {
        $state.transitionTo('menu.profile', $stateParams, { reload: true, inherit: false, notify: true });
    }

});

module.controller('presentStrandCtrl', function ($scope, $state, $stateParams) {

    $scope.fairStands = {name: "FEUP CARRER FAIR", stands: [{id: 1, stand: "AMT Consulting", standNumber: 15, logo: "img/Amt consulting.png"},{id: 2, stand: "AMT Consulting", standNumber: 15, logo: "img/Amt consulting.png"},{id: 3, stand: "AMT Consulting", standNumber: 15, logo: "img/Amt consulting.png"}]};

    $scope.loadProfile = function(id) {
        $state.transitionTo('menu.profile', $stateParams, { reload: true, inherit: false, notify: true });
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
        return event.time;
    })
    .groupBy(function(event) {
        return event.time;
    }).value();

    $scope.scheduleDays = _.chain(schedule)
    .sortBy(function(event) {
        return event.time;
    })
    .map(function(event) {
        var time = new Date(event.time);
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

        //var ihour;
        //var fhour;
        //var iminute;
        //var fminute;
        //
        //if(starHour < 10) {
        //    ihour = "0" + starHour;
        //} else {
        //    ihour = "" + starHour;
        //}
        //
        //if(startMinute < 10) {
        //    iminute = "0" + startMinute;
        //} else {
        //    iminute = "" + startMinute;
        //}
        //
        //if(endHour < 10) {
        //    fhour = "0" + endHour;
        //} else {
        //    fhour = "" + endHour;
        //}
        //
        //if(endMinute < 10) {
        //    fminute = "0" + endMinute;
        //} else {
        //    fminute = "" + endMinute;
        //}

        //$scope.event = {id: id, eventName: eventName, fairName: fairName, startHour: ihour, startMinute: iminute, endHour: fhour, endMinute: fminute, day: day, month: month, year: year, place: place};
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
                        var eventNotes = fairName + " \nSpeakers: " + $scope.liveFairEvent.Speakers;
                        calendar.createEventInteractively(fairName, $scope.liveFairEvent.Subject, $scope.liveFairEvent.Speakers, $scope.liveFairEvent.time, $scope.liveFairEvent.endTime);
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

module.controller('listFairsCtrl', function ($scope, $state, $stateParams, listfairs, utils, liveFairApi, $localStorage) {

    $scope.failedToResolve = listfairs == "failed to resolve";
    if($scope.failedToResolve)
        return;

    $scope.username = $localStorage.get('userEmail');
    $scope.userID = $localStorage.get('userID');
    $scope.listfairs = listfairs;

    $scope.formatMonth = function() {
        for(i = 0; i < $scope.listfairs.length; i++) {
            $scope.listfairs[i].month = utils.getMonthName($scope.listfairs[i].month);
        }
    };

    $scope.loadFairVisitors=function(fairID)
    {
        $state.go('visitors', {fairID: fairID});
    };

     $scope.loadFairCompanies=function(fairID)
    {
        $state.go('companies', {fairID: fairID});
    };

    $scope.loadPastFairs = function(){
        $scope.listfairs = listfairs;
        var pastFairs=[];
        var curdate = new Date();
        for(i = 0; i < $scope.listfairs.length; i++) {
            var fairDate = new Date($scope.listfairs[i].endDate);
            if( fairDate < curdate)
            {
               pastFairs.push($scope.listfairs[i]);
           }
       }
       $scope.listfairs=pastFairs;
       console.log($scope.listfairs.length);

   };

   $scope.loadNextFairs = function(){
    $scope.listfairs = listfairs;
    var nextFairs=[];
    var curdate = new Date();
    for(i = 0; i < $scope.listfairs.length; i++) {
        var fairDate = new Date($scope.listfairs[i].startDate);
        if( fairDate > curdate)
        {
            nextFairs.push($scope.listfairs[i]);
        }  
    }
    $scope.listfairs=nextFairs;
    console.log($scope.listfairs.length);
};

$scope.loadCurrentFairs = function(){
    $scope.listfairs = listfairs;
    var nextFairs=[];
    var curdate = new Date();
    for(i = 0; i < $scope.listfairs.length; i++) {
        var sDate = new Date($scope.listfairs[i].startDate);
        var eDate = new Date($scope.listfairs[i].endDate);
        if( sDate <= curdate && curdate <= eDate)
        {
            nextFairs.push($scope.listfairs[i]);
        }  
    }
    $scope.listfairs=nextFairs;
    console.log($scope.listfairs.length);
};


$scope.newFair = function(userID)
{
    var organizerID = userID;
    document.getElementById('mapFile').onchange = function () {
      var mapFileName = this.value.replace(/^.*[\\\/]/, '');
    };

  var sDate = new Date($scope.sdate);
  var eDate = new Date($scope.edate);
  liveFairApi.newLiveFair(organizerID, $scope.name, $scope.description, sDate, 
    eDate, $scope.local,$scope.address, $scope.city, "noimage.jpg");
};
});

module.controller('fairVisitorsCtrl', function ($scope, $state, $stateParams, utils, liveFairApi, $localStorage) {
     $scope.username = $localStorage.get('userEmail');
     var fairID = $stateParams.fairID;
     $scope.fairVisitorsIDs = liveFairApi.getLiveFairVisitors(fairID);
});

module.controller('fairCompaniesCtrl', function ($scope, $state, $stateParams, utils, liveFairApi, $localStorage) {
     $scope.username = $localStorage.get('userEmail');
     var fairID = $stateParams.fairID;
     $scope.fairCompanies = liveFairApi.getLiveFairStands(fairID);
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

        /*if($scope.fair.description == null)
         $scope.showDescription = false;

         if($scope.fair.map == null)
           $scope.showMap = false;*/
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
                console.log("tapped submit button");
            }
        }
        ]
    });
};

$scope.loadStands = function(fairID) {
    $state.go('menu.fairStands', {fairID: fairID});
};

$scope.loadEvents = function(fairID) {
    $state.go('menu.fairProgram', {fairID: fairID});
}

});

module.controller('searchFairCtrl', function ($scope, $state, $stateParams, $ionicPopup, utils, liveFairApi) {

    $scope.startDate = "";
    $scope.endDate = "";
    $scope.searchName = "";
    $scope.searchLocation = "";
    $scope.listfairs = "";
    $scope.existingFairs = liveFairApi.getLiveFairs();

    var actualDate = new Date();
    var day = actualDate.getUTCDate();
    var month = actualDate.getMonth() + 1;
    var year = actualDate.getFullYear();

    $scope.filterByDate = function() {
        var myPopup = $ionicPopup.show({
            templateUrl: "templates/searchFairs-datePopUp.html",
            scope: $scope,
            buttons: [
            {
                text: '<b>Limpar</b>',
                    onTap: function(e) { //lets clean date filters
                        $scope.listfairs = $scope.existingFairs;
                        $scope.startDate = "";
                        $scope.endDate = "";
                    }
                },
                {
                    text: '<b>Ok</b>',
                    type: 'button-positive',
                    onTap: function(e) { //lets filter this stuff
                        var tempArray = [];
                        $scope.listfairs = $scope.existingFairs;
                        $scope.startDate = utils.getStartDate();
                        $scope.endDate = utils.getEndDate();
                        startDateConverted = Number(new Date($scope.startDate));
                        endDateConverted = Number(new Date($scope.endDate));
                        for(var i = 0; i < $scope.listfairs.length; i++) {
                            fairDate = $scope.listfairs[i].date.substring(0,10);
                            fairDateConverted = Number(new Date(fairDate));
                            if(fairDateConverted >= startDateConverted && fairDateConverted <= endDateConverted) {
                                tempArray.push($scope.listfairs[i]);
                            }
                        }
                        $scope.listfairs = tempArray;
                    }
                },
                ]
            });
}

$scope.verifyDate = function() {
    actualDateConverted = Number(actualDate);
    if($scope.startDate !== "") {
        startDateConverted = Number(new Date($scope.startDate));
        if(startDateConverted < actualDateConverted) {
            if(day < 10 && (day.length < 2 || day.length === undefined)) {
                day = "0" + day;
            }
            if(month < 10 && (month.length < 2 || month.length === undefined)) {
                month = "0" + month;
            }
            $scope.startDate = year + "-" + month + "-" + day;
            utils.setStartDate($scope.startDate);
        } else {
            utils.setStartDate($scope.startDate);
        }
    }

    if($scope.endDate !== "") {
        endDateConverted = Number(new Date($scope.endDate));
        if(endDateConverted < actualDateConverted) {
            if(day < 10 && (day.length < 2 || day.length === undefined)) {
                day = "0" + day;
            }
            if(month < 10 && (month.length < 2 || month.length === undefined)) {
                month = "0" + month;
            }
            $scope.endDate = year + "-" + month + "-" + day;
            utils.setEndDate($scope.endDate);
        } else {
            utils.setEndDate($scope.endDate);
        }
    }
}

$scope.loadFair = function(fairID){
    $state.go('menu.fair', {fairID: fairID});
}

$scope.getFairs = function() {
    $scope.listfairs = $scope.existingFairs;
}

});