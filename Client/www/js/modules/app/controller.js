var module = angular.module('starter');

module.controller('toogleCtrl', function($scope, $ionicSideMenuDelegate, $rootScope, $state, $stateParams, $translate, $localStorage, $localForage) {
    $scope.username = "AMT Consulting";

    $scope.items = [
        {path: "menu.home", name: "Home"},
        {path: "menu.login", name: "Login"},
        {path: "menu.register", name: "Registo"},
        {path: "menu.listfairs", name: "Feiras"},
        {path: "menu.searchFairs", name: "Pesquisa"}
    ];

    $localForage.getItem('userType').then(function(result) {
        $rootScope.userType = result || "";
    });

    $scope.toggleRight = function() {
        $ionicSideMenuDelegate.toggleRight();
    };

    $scope.selectItem = function($index) {
        $state.go($scope.items[$index].path, $stateParams);
    };

    $scope.loadSettings = function() {
        $state.go("menu.settings");
    };

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