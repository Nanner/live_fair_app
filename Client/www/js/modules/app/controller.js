var module = angular.module('starter');

module.controller('toogleCtrl', function($scope, $ionicSideMenuDelegate, $state, $stateParams, $translate) {
    
    $scope.username = "AMT Consulting";
    var settingsName = $translate.instant('settings');
    $scope.items = [
        {path: "menu.home", name: "Home"},
        {path: "menu.login", name: "Login"},
        {path: "menu.register", name: "Registo"},
        {path: "menu.listfairs", name: "Feiras"},
        {path: "menu.searchFairs", name: "Pesquisa"},
        {path: "menu.settings", name: settingsName}
    ];

    $scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	}
    
    $scope.selectItem = function($index) {
        //TODO: Do we need $stateParams, { reload: true, inherit: false, notify: true }
        //$state.go($scope.items[$index].path);
        $state.transitionTo($scope.items[$index].path, $stateParams, {reload: true,inherit: false,notify: true});
    }
});