var module = angular.module('homeModule');

module.controller('homeCtrl', function ($rootScope, $scope, $state){

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
