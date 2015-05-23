var module = angular.module('starter');

module.controller('toogleCtrl', function($scope, $ionicSideMenuDelegate, $rootScope, $state, $stateParams, $translate, $localStorage) {
    $scope.username = "AMT Consulting";

    $scope.items = [
        {path: "menu.home", name: "Home"},
        {path: "menu.login", name: "Login"},
        {path: "menu.register", name: "Registo"},
        {path: "menu.listfairs", name: "Feiras"},
        {path: "menu.searchFairs", name: "Pesquisa"},
<<<<<<< HEAD
        {path: "menu.ownProfile", name: "Profile"}];
=======
        {path: "menu.settings", name: $translate.instant('settings')}
    ];


>>>>>>> 0f1c0cc2682b370cecc6ce3b4780168fbbb0307a

    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.selectItem = function($index) {
        //TODO: Do we need $stateParams, { reload: true, inherit: false, notify: true }
        //$state.go($scope.items[$index].path);
        $state.transitionTo($scope.items[$index].path, $stateParams, {reload: true,inherit: false,notify: true});
    }

    $scope.loadProfile = function() {
        $state.go("menu.ownProfile", {companyID: $localStorage.get('userID')});
    }
});