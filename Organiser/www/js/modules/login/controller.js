var module = angular.module('loginModule');

module.controller('loginCtrl', function ($scope, $state, $stateParams, liveFairApi, $localStorage, $ionicModal) {
    
    $scope.username = "";
    $scope.password = "";

    $scope.submitLogin = function() {
        var passwordEncrypted = CryptoJS.SHA256($scope.password).toString();
        var noErr = liveFairApi.login($scope.username, passwordEncrypted);
        
        $scope.$on('event:auth-loginConfirmed', function() {
            $state.go('livefairs');
        });

        $scope.$on('event:auth-login-failed', function(event, status) {
            if (!event.defaultPrevented) {
                event.defaultPrevented = true;
            }
        });
    }
});