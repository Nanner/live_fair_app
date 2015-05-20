var module = angular.module('fairModule');

module.controller('fairStandsCtrl', function ($scope, $state, $stateParams, liveFairApi) {
    var liveFairID = $stateParams.fairID;
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
   
    $scope.loadEvent = function(id, eventName, fairName, starHour, startMinute, endHour, endMinute, day, month, year, place) {

        var ihour;
        var fhour;
        var iminute;
        var fminute;

        if(starHour < 10) {
            ihour = "0" + starHour;
        } else {
            ihour = "" + starHour;
        }

        if(startMinute < 10) {
            iminute = "0" + startMinute;
        } else {
            iminute = "" + startMinute;
        }

        if(endHour < 10) {
            fhour = "0" + endHour;
        } else {
            fhour = "" + endHour;
        }

        if(endMinute < 10) {
            fminute = "0" + endMinute;
        } else {
            fminute = "" + endMinute;
        }

        $scope.event = {id: id, eventName: eventName, fairName: fairName, startHour: ihour, startMinute: iminute, endHour: fhour, endMinute: fminute, day: day, month: month, year: year, place: place};

        var myPopup = $ionicPopup.show({
        templateUrl: "templates/eventPopup.html",
        title: fairName,
        scope: $scope,
        buttons: [ 
          {
            text: '<b>Sync</b>',
            type: 'button-balanced',
            onTap: function(e) {
                //Create event in phone's calendar
                
                var monthToSend = month - 1;
                calendar.createEventInteractively(eventName, fairName, "Participar", year, monthToSend, day, starHour, startMinute, endHour, endMinute);
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

    //$scope.listfairs = [{name: "derp1", startHour: 10, startMinute: 30, startDay: 5, endDay: 8, month: 3, address: "Rua Exemplo"},{name: "derp2", startHour: 10, startMinute: 30, startDay: 5, endDay: 8, month: 3, address: "Rua de Exemplo"},{name: "derp3", startHour: 10, startMinute: 30, startDay: 5, endDay: 8, month: 3, address: "Rua Exemplo"}];
    $scope.listfairs = liveFairApi.getLiveFairs();

    $scope.formatMonth = function() {
        for(i = 0; i < $scope.listfairs.length; i++) {
            $scope.listfairs[i].month = utils.getMonthName($scope.listfairs[i].month);
        }
    };

    $scope.loadFair = function(fairID){
        $state.go('menu.fair', {fairID: fairID});
    }
});


module.controller('fairCtrl', function($scope, $state, $stateParams, $ionicPopup, utils, liveFairApi) {

    var liveFairID = $stateParams.fairID;
    $scope.fair = liveFairApi.getLiveFair(liveFairID);   
    $scope.hideMap = false;
    $scope.month = ""; 
    $scope.description = true;
    
    //$scope.fair = {name: "FEUP CARRER FAIR", place: "FEUP", startDay: 18, endDay: 20, month: 11, startHour: 9, startMinute: 30, closingHour: 18, closingMinute: 30, address: "Rua Doutor Roberto Frias", description: "A CAREER FAIR tem como principal objetivo reunir na FEUP empresas nacionais e internacionais interessadas em divulgarem as suas ofertas de emprego ou estágios e em recrutarem estudantes, recém-graduados e alumni FEUP.", map: "img/liveFair-Map.png"};
    
    //$scope.interestsList = [{name: "Sap", checked: false},{name: "Informática", checked: false},{name: "Programação", checked: false},{name: "Empreendedorismo", checked: false}];
    $scope.interestsList = liveFairApi.getLiveFairInterests(liveFairID);
    console.log($scope.interestsList);

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
        templateUrl: "templates/chooseInterests.html",
        title: 'Adesão',
        scope: $scope,
        buttons: [ 
          { text: 'Cancelar' },
          {
            text: '<b>Selecionar</b>',
            type: 'button-positive',
            onTap: function(e) {
                console.log("tapped submit button");
            }
          },
        ]
      });  
    }
    
    $scope.loadStands = function(fairID) {
       $state.go('menu.fairStands', {fairID: fairID});
    }

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
    $scope.sortOption = 0;

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
        {
            $scope.listfairs = $scope.existingFairs;
        }

/*
        $scope.listfairs = [
             {
                name: "afeira1",
                date: "15.07.2015 00:00:00",
                 local: "porto"
            },
            {
                name: "cfeira2",
                date: "12.06.2015",
                local: "lisboa"
            },
            {
                name: "zfeira3",
                date: "12.06.2014",
                local: "braga"
            },
            {
                name: "bfeira3",
                date: "16.05.2015",
                local: "coimbra"
            }
        ]*/

        $scope.sortOption = 0;

    }

    $scope.sortFairsByName = function(){

        if($scope.sortOption === 1){
            $scope.listfairs.reverse();
        }else{
            $scope.sortOption = 1;
            $scope.listfairs =  _.sortBy($scope.listfairs, "name");
        }
    };

    $scope.sortFairsByDate = function(){

        if($scope.sortOption === 2) {
            $scope.listfairs.reverse();
        }else{
            $scope.sortOption = 2;
            $scope.listfairs = _.sortBy( $scope.listfairs, function(fair) {
                return fair.date;
                //var dateOnly = fair.date.split(" ");
                //var parts = dateOnly[0].split(".");
                //return (new Date(+parts[2], parts[1]-1, +parts[0])).getTime();
            });
        }
    }

});