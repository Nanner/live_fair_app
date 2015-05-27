var module = angular.module('loginModule');

module.controller('loginCtrl', function ($scope, $state, $stateParams, liveFairApi, $localStorage, $ionicModal) {

    $scope.loadHome = function() {
        $state.go('home');
        
    };
    
    $scope.username = "";
    $scope.password = "";

    $scope.letMeRegister = function() {
        $state.transitionTo('menu.register', $stateParams, { reload: true, inherit: false, notify: true });
    }
    
    $scope.submitLogin = function() {
        var passwordEncrypted = CryptoJS.SHA256($scope.password).toString();
        var noErr = liveFairApi.login($scope.username, passwordEncrypted);
        if($localStorage.get('userEmail') == $scope.username)
                $scope.loadHome();
            else
                console.log("login error");
    }
});