var module = angular.module('fairModule');

module.controller('fairCtrl', function($scope, $state, $stateParams, $ionicPopup, utils) {
    
    $scope.map = true;
    $scope.month = "";
    $scope.description = true;
    $scope.fair = {name: "FEUP CARRER FAIR", place: "FEUP", startDay: 18, endDay: 20, month: 11, openingTime: 9, closingTime: 18, address: "Rua Doutor Roberto Frias", description: "A CAREER FAIR tem como principal objetivo reunir na FEUP empresas nacionais e internacionais interessadas em divulgarem as suas ofertas de emprego ou estágios e em recrutarem estudantes, recém-graduados e alumni FEUP.", map: "img/liveFair-Map.png"};

    $scope.listfairs = [{name: "derp1", startDay: 5, endDay: 8, month: 3, address: "Rua das pilinhas"},{name: "derp2", startDay: 5, endDay: 8, month: 3, address: "Rua das pilinhas"},{name: "derp3", startDay: 5, endDay: 8, month: 3, address: "Rua das pilinhas"}]

    $scope.interestsList = [{name: "Sap", checked: false},{name: "Informática", checked: false},{name: "Programação", checked: false},{name: "Empreendedorismo", checked: false}];
    
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

});