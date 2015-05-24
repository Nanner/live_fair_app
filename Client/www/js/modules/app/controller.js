var module = angular.module('starter');

module.controller('toogleCtrl', function($scope, $ionicSideMenuDelegate, $rootScope, $state, $stateParams, $translate, $localStorage, $localForage) {
    $scope.username = "AMT Consulting";

    $scope.items = [
        {path: "menu.home", name: "Home"},
        {path: "menu.login", name: "Login"},
        {path: "menu.register", name: "Registo"},
        {path: "menu.listfairs", name: "Feiras"},
        {path: "menu.searchFairs", name: "Pesquisa"},
        {path: "menu.settings", name: $translate.instant('settings')}
    ];

    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.selectItem = function($index) {
        //TODO: Do we need $stateParams, { reload: true, inherit: false, notify: true }
        //$state.go($scope.items[$index].path);
        $state.transitionTo($scope.items[$index].path, $stateParams, {reload: true,inherit: false,notify: true});
    }

    $scope.loadProfile = function() {
        var userID = "";
        $localForage.getItem('userID').then(function(response) {
                userID = response;
                $state.go("menu.ownProfile", {companyID: userID});
            }, function(response) {
                utils.showAlert($translate.instant('notOpenOwnProfile'), "Error");
            }
        );
    }
});