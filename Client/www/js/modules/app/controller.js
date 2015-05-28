var module = angular.module('starter');

module.controller('toogleCtrl', function($scope, $ionicSideMenuDelegate, $rootScope, $state, $stateParams, $translate, $localStorage, $localForage, $ionicHistory) {
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
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go($scope.items[$index].path, $stateParams);
    };

    $scope.loadSettings = function() {
        $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $state.go("menu.settings");
    };

    $scope.loadProfile = function() {
        var userID = "";
        $localForage.getItem('userID').then(function(response) {
                userID = response;
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go("menu.ownProfile", {companyID: userID});
            }, function(response) {
                utils.showAlert($translate.instant('notOpenOwnProfile'), "Error");
            }
        );
    }
});