var module = angular.module('fairModule');

module.controller('fairStandsCtrl', function ($scope, $state, $stateParams, liveFairApi) {
    var liveFairID = $stateParams.fairID;
    var liveFairStands = liveFairApi.getLiveFairStands(liveFairID);
    console.log(liveFairStands);


    $scope.fairStands = {name: "FEUP CARRER FAIR", stands: [{id: 1, stand: "AMT Consulting", standNumber: 15, logo: "img/Amt consulting.png"},{id: 2, stand: "AMT Consulting", standNumber: 15, logo: "img/Amt consulting.png"},{id: 3, stand: "AMT Consulting", standNumber: 15, logo: "img/Amt consulting.png"}]};

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

module.controller('fairProgramCtrl', function ($scope, $state, $stateParams, $ionicPopup, calendar) {
    
    $scope.events = {name: "FEUP CARRER FAIR", hours: [
        {hour: 9, events: [ 
            {id: 1, name: "Evento 1", fairName: "FEUP CARRER FAIR", startHour: 9, startMinute: 0, endHour: 11, endMinute: 0, day: 15, month: 4, year:2015, place: "A001"},
            {id: 2, name: "Evento 2", fairName: "FEUP CARRER FAIR", startHour: 9, startMinute: 0, endHour: 10, endMinute: 0, day: 15, month: 4, year:2015, place: "B001"}
            ] 
        }, 
        {hour: 10, events: [ 
            {id: 3, name: "Evento 3", fairName: "FEUP CARRER FAIR", startHour: 10, startMinute:30, endHour: 12, endMinute: 0, day: 15, month: 4, year:2015, place: "B002"}
            ] 
        }, 
        {hour: 11, events: [
            {id: 4, name: "Evento 4", fairName: "FEUP CARRER FAIR", startHour: 11, startMinute: 0, endHour: 13, endMinute: 30, day: 15, month: 4, year:2015, place: "B001"},
            {id: 5, name: "Evento 5", fairName: "FEUP CARRER FAIR", startHour: 11, startMinute: 0, endHour: 12, endMinute: 0, day: 15, month: 4, year:2015, place: "A001" }
            ]
        },
        {hour: 12, events: [
            {id: 6, name: "Evento 6", fairName: "FEUP CARRER FAIR", startHour: 12, startMinute: 0, endHour: 14, endMinute: 0, day: 15, month: 4, year:2015, place: "B003"}
            ]
        }
    ]};    
   
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
    
    $scope.interestsList = [{name: "Sap", checked: false},{name: "Informática", checked: false},{name: "Programação", checked: false},{name: "Empreendedorismo", checked: false}];

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

    $scope.loadEvents = function() {
        $state.transitionTo('menu.fairProgram', $staiteParams, { reload: true, inherit: false, notify: true });      
    }
    
});

module.controller('searchFairCtrl', function ($scope, $state, $stateParams, $ionicPopup, utils, liveFairApi) {

    $scope.startDate = "";
    $scope.endDate = "";
    $scope.searchName = "";
    $scope.searchLocation = "";
    $scope.listfairs = liveFairApi.getLiveFairs();
    //$scope.listfairs = [{name: "massa", startHour: 10, startMinute: 30, startDay: 5, endDay: 8, month: 3, location: "ruaceninhasetal"},{name: "atum", startHour: 10, startMinute: 30, startDay: 5, endDay: 8, month: 3, location: "coisasgordas"},{name: "cenoura", startHour: 10, startMinute: 30, startDay: 5, endDay: 8, month: 3, location: "basexaltura"}];

    var actualDate = new Date();
    var day = actualDate.getUTCDate();
    var month = actualDate.getMonth() + 1;
    var year = actualDate.getFullYear();

    $scope.filterByDate = function() {
        var myPopup = $ionicPopup.show({
            templateUrl: "templates/searchFairs-datePopUp.html",
            scope: $scope,
            buttons: [
              { text: 'Cancelar' },
              {
                text: '<b>Ok</b>',
                type: 'button-positive',
                onTap: function(e) {
                    console.log("tapped submit button");
                }
              },
            ]
        });   
    }

    $scope.verifyDate = function() {
        actualDateConverted = Number(actualDate);
        if($scope.startDate !== "") {
            startDateConverted = Number(new Date($scope.startDate));
            if(startDateConverted < actualDateConverted) { //shit happened
                if(day < 10 && (day.length < 2 || day.length === undefined)) {
                    day = "0" + day;
                }
                if(month < 10 && (month.length < 2 || month.length === undefined)) {
                    month = "0" + month;
                }
                $scope.startDate = year + "-" + month + "-" + day;
            }
        }

        if($scope.endDate !== "") {
            endDateConverted = Number(new Date($scope.endDate));
            if(endDateConverted < actualDateConverted) { //shit happened
                if(day < 10 && (day.length < 2 || day.length === undefined)) {
                    day = "0" + day;
                }
                if(month < 10 && (month.length < 2 || month.length === undefined)) {
                    month = "0" + month;
                }
                $scope.endDate = year + "-" + month + "-" + day;
            }
        }
    }

    $scope.loadFair = function(fairID){
        $state.go('menu.fair', {fairID: fairID});
    }

});