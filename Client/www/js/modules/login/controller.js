var module = angular.module('loginModule');

module.controller('loginCtrl', function ($scope, $state, $stateParams, liveFairApi, $localStorage, utils) {

    //$scope.callLoginModal = function() {
    //    $ionicModal.fromTemplateUrl('templates/login.html', function (modal) {
    //            $scope.loginModal = modal;
    //        },
    //        {
    //            scope: $scope,
    //            animation: 'slide-in-up',
    //            focusFirstInput: true
    //        }
    //    );
    //
    //    //Be sure to cleanup the modal by removing it from the DOM
    //    $scope.$on('$destroy', function() {
    //        $scope.loginModal.remove();
    //    });
    //};

    //$scope.$on('event:auth-loginRequired', function(e, rejection) {
    //    console.log(e);
    //});
    //
    //$scope.$on('event:auth-loginConfirmed', function() {
    //    $state.go('menu.listfairs');
    //});
    //
    //$scope.$on('event:auth-login-failed', function(e, status) {
    //    console.log("boom");
    //});
    //
    //$scope.$on('event:auth-logout-complete', function() {
    //    console.log("boom boom");
    //    //$state.go('app.home', {}, {reload: true, inherit: false});
    //});
    
    $scope.username = "";
    $scope.password = "";

    $localStorage.remove('token');
    $localStorage.remove('userID');
    $localStorage.remove('userEmail');
    $localStorage.remove('userType');

    $scope.letMeRegister = function() {
        $state.transitionTo('menu.register', $stateParams, { reload: true, inherit: false, notify: true });
    };
    
    $scope.submitLogin = function() {
        var passwordEncrypted = CryptoJS.SHA256($scope.password).toString();
        liveFairApi.login($scope.username, passwordEncrypted);

        $scope.$on('event:auth-loginConfirmed', function() {
            $state.go('menu.listfairs');
        });

        $scope.$on('event:auth-login-failed', function(e, status) {
            utils.showAlert("Utilizador ou password errados", "Falha no login");
        });
    }
});