var module = angular.module('starter');

module.controller('toogleCtrl', function($scope, $ionicSideMenuDelegate, $state, $stateParams) {
    
    $scope.username = "AMT Consulting";
    $scope.items = [
        {path: "menu.home", name: "Home"},
        {path: "menu.login", name: "Login"},
        {path: "menu.register", name: "Registo"},
        {path: "menu.fair", name: "Feira"},
        {path: "menu.listfairs", name: "Feiras"}];

    $scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	}
    
    $scope.selectItem = function($index) {
        //TODO: Do we need $stateParams, { reload: true, inherit: false, notify: true }
        $state.go($scope.items[$index].path);
    }
});