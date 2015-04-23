var module = angular.module('loginModule');

module.controller('loginCtrl', function ($scope, $state, $stateParams) {
    
    $scope.username = "";
    $scope.password = "";
    
    $scope.submitLogin = function() {
        console.log("tapped submit button");
    }
});