var module = angular.module('loginModule');

module.controller('loginCtrl', function ($scope, $state, $stateParams) {
    
    $scope.username = "";
    $scope.password = "";
    
    $scope.submitLogin = function() {
        var passwordEncrypted = CryptoJS.SHA256($scope.password).toString();
        console.log("tapped submit button");
    }
});