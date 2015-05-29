var module = angular.module('starter');

module.controller('toogleCtrl', function($scope, $ionicSideMenuDelegate, $rootScope, $state, $stateParams, $translate, $localStorage, $localForage, $ionicHistory) {
    $scope.username = "AMT Consulting";

    $scope.items = [
        {path: "menu.listfairs", name: "Feiras"},
        {path: "menu.searchFairs", name: "Pesquisa"}
    ];

    $localForage.getItem('userType').then(function(result) {
        $rootScope.userType = result || "";
    });

    $localForage.getItem('isAuthenticated').then(function(result) {
        if(result === true)
            $rootScope.isAuthenticated = true;
        else
            $rootScope.isAuthenticated = false;
    }, function(error) {
        $rootScope.isAuthenticated = false;
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

    $scope.loadHome = function() {
        $localForage.getItem('isAuthenticated').then(function(result) {
            if(result === true)
                $rootScope.isAuthenticated = true;
            else
                $rootScope.isAuthenticated = false;

            if($rootScope.isAuthenticated) {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go("menu.listfairs");
            }
            else {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go("menu.home");
            }
        }, function(error) {
            $rootScope.isAuthenticated = false;
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go("menu.home");
        });
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