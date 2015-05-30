var module = angular.module('homeModule');

module.controller('homeCtrl', function ($rootScope, $scope, $state, $localForage, $ionicHistory){
    $scope.isAuthenticated = true;
    $scope.checkAuthenticated = function() {
        $localForage.getItem('isAuthenticated').then(function (result) {
            if (result === true) {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('menu.listfairs');
            }
            else
                $scope.isAuthenticated = false;
        });
    };


    $scope.loadLogin = function() {
        $state.go('menu.login');
    };

    $scope.loadRegistration = function() {
        $state.go('menu.register');
    };

    $scope.loadFairListing = function() {
        $state.go('menu.listfairs');
    };
});
