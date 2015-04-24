var module = angular.module('starter');

module.controller('toogleCtrl', function($scope, $ionicSideMenuDelegate, $state, $stateParams) {
    
    $scope.username = "AMT Consulting";
    $scope.items = [{name: "Login", id: 0}, {name: "Registo", id: 1}, {name: "Feira", id: 2}, {name: "Feiras", id: 3}];
    
    $scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	}
    
    $scope.selectItem = function($index) {
        switch($index) {
            case 0: //login
                $state.go('menu.login');
                break;
            case 1: //registo
                $state.transitionTo('menu.register', $stateParams, { reload: true, inherit: false, notify: true });
                break;
            case 2: //feira
                $state.transitionTo('menu.fair', $stateParams, { reload: true, inherit: false, notify: true });
                break;
            case 3: //listar feiras
                $state.transitionTo('menu.listfairs', $stateParams, { reload: true, inherit: false, notify: true });
                break;
            default: 
                break;
        }
    }
});