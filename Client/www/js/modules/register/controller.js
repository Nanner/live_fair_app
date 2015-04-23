var module = angular.module('registerModule');

module.controller('registerCtrl', function ($scope, $state, $stateParams) {
    
    $scope.usertype = true; //true -> empresa, false -> visitante
    $scope.name = "";
    $scope.lastName = "";
    $scope.username = "";
    $scope.password = "";
    $scope.confirmPassword = "";
    $scope.passwordEncrypted = "";
    $scope.email = "";
    $scope.website = "";
    $scope.phone = "";
    $scope.address = "";
    $scope.termsAcceptance = false;
    
    $scope.submitRegister = function() {
        console.log("tapped submit button");
    }

});