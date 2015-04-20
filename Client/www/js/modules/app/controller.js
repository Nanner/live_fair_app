var module = angular.module('starter');

module.controller('toogleCtrl', function($scope, $ionicSideMenuDelegate, $state, $stateParams) {
    
    $scope.username = "AMT Consulting";
    $scope.items = ['login', 'registo', 'feiras'];
    
    $scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	}
    
    $scope.selectItem = function($index) {
        switch($index) {
            case 0: //login
                $state.go('menu.login');
                break;
            case 1: //registo
                $state.go('menu.login');
                break;
            case 2: //feiras
                $state.go('menu.login');
                break;
            default: 
                break;
        }
    }
});