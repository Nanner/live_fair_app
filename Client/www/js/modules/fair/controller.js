var module = angular.module('fairModule');

module.controller('fairCtrl', function($scope, $state, $stateParams, $ionicPopup, utils) {
    
    $scope.map = true;
    $scope.month = ""; 
    $scope.description = true;
    
    $scope.fair = {name: "FEUP CARRER FAIR", place: "FEUP", startDay: 18, endDay: 20, month: 11, openingTime: 9, closingTime: 18, address: "Rua Doutor Roberto Frias", description: "A CAREER FAIR tem como principal objetivo reunir na FEUP empresas nacionais e internacionais interessadas em divulgarem as suas ofertas de emprego ou estágios e em recrutarem estudantes, recém-graduados e alumni FEUP.", map: "img/liveFair-Map.png"};
    
    $scope.interestsList = [{name: "Sap", checked: false},{name: "Informática", checked: false},{name: "Programação", checked: false},{name: "Empreendedorismo", checked: false}];

    $scope.listfairs = [{name: "derp1", startDay: 5, endDay: 8, month: 3, address: "Rua Exemplo"},{name: "derp2", startDay: 5, endDay: 8, month: 3, address: "Rua de Exemplo"},{name: "derp3", startDay: 5, endDay: 8, month: 3, address: "Rua Exemplo"}]
    
    $scope.fairStands = {name: "FEUP CARRER FAIR", stands: [{stand: "AMT Consulting", standNumber: 15, logo: "img/Amt consulting.png"},{stand: "AMT Consulting", standNumber: 15, logo: "img/Amt consulting.png"},{stand: "AMT Consulting", standNumber: 15, logo: "img/Amt consulting.png"}]};
    
    $scope.events = {name: "FEUP CARRER FAIR", hours: [
        {hour: 9, events: [ 
            {id: 1, name: "Evento 1", fairName: "FEUP CARRER FAIR", startTime: 9, endTime: 11, place: "A001"},
            {id: 2, name: "Evento 2", fairName: "FEUP CARRER FAIR", startTime: 9, endTime: 10, place: "B001"}
            ] 
        }, 
        {hour: 10, events: [ 
            {id: 3, name: "Evento 3", fairName: "FEUP CARRER FAIR", startTime: 10, endTime: 12, place: "B002"}
            ] 
        }, 
        {hour: 11, events: [
            {id: 4, name: "Evento 4", fairName: "FEUP CARRER FAIR", startTime: 11, endTime: 13, place: "B001"},
            {id: 5, name: "Evento 5", fairName: "FEUP CARRER FAIR", startTime: 11, endTime: 12, place: "A001" }
            ]
        },
        {hour: 12, events: [
            {id: 6, name: "Evento 6", fairName: "FEUP CARRER FAIR", startTime: 12, endTime: 14, place: "B003"}
            ]
        }
    ]};

    $scope.loadFairProfile = function() {
        $scope.month = utils.getMonthName($scope.fair.month);
        
        if($scope.fair.description == null)
            $scope.description = false;
        
        if($scope.fair.map == null)
            $scope.map = false;
    }

    $scope.loadFair = function(){
        $state.transitionTo('menu.fair', $stateParams, { reload: true, inherit: false, notify: true });
    }
    
    $scope.chooseInterests = function() {
        var myPopup = $ionicPopup.show({
	    template: '<div class="list"><div class="item item-divider">Escolha os seus interesses</div><ion-toggle ng-repeat="item in interestsList" ng-model="item.checked" toggle-class="toggle-calm">{{item.name}}</ion-toggle></div>',
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
    
    $scope.loadStands = function() {
       $state.transitionTo('menu.presentStands', $stateParams, { reload: true, inherit: false, notify: true });
    }

    $scope.loadEvents = function() {
        $state.transitionTo('menu.fairProgram', $stateParams, { reload: true, inherit: false, notify: true });      
    }

    $scope.loadEvent = function(id, eventName, fairName, startTime, endTime, place) {
        $scope.event = {id: id, eventName: eventName, fairName: fairName, startTime: startTime, endTime: endTime, place: place};

        var myPopup = $ionicPopup.show({
        template: '<div class="list list-inset"><div class="item item-divider event-title"><strong>{{event.eventName}}</strong></div><div class="item event-subtitle"><strong>inicio:</strong><span class="event-info">{{event.startTime}}</span></div><div class="item event-subtitle"><strong>fim:</strong><span class="event-info">{{event.endTime}}</span></div><div class="item event-subtitle"><strong>Local:</strong><span class="event-info">{{event.place}}</span></div></div>',
        title: fairName,
        scope: $scope,
        buttons: [ 
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