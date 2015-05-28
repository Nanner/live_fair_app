var module = angular.module('loginModule');

module.controller('loginCtrl', function ($scope, $state, $stateParams, liveFairApi, $localStorage, utils, $ionicHistory) {
    $scope.username = "";
    $scope.password = "";

    $scope.letMeRegister = function() {
        $state.transitionTo('menu.register', $stateParams, { reload: true, inherit: false, notify: true });
    };
    
    $scope.submitLogin = function() {
        var passwordEncrypted = CryptoJS.SHA256($scope.password).toString();
        liveFairApi.login($scope.username, passwordEncrypted);

        $scope.$on('event:auth-loginConfirmed', function() {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('menu.listfairs');
        });

        $scope.$on('event:auth-login-failed', function(e, status) {
            utils.showAlert("Utilizador ou password errados", "Falha no login");
        });
    }
});