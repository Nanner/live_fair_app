var module = angular.module('homeModule');

module.controller('homeCtrl', function ($scope, $state, $stateParams, utils){

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
