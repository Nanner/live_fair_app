var module = angular.module('settingsModule');

module.controller('settingsCtrl', function($rootScope, $scope, $state, $stateParams, liveFairApi, utils, $translate, $localForage, $ionicPopup, $ionicHistory) {
    $rootScope.isAuthenticated = false;
    $localForage.getItem('isAuthenticated').then(function(result) {
        $rootScope.isAuthenticated = result || false;
    });

    $localForage.getItem('userEmail').then(function(result) {
        $rootScope.userEmail = result || "";
    });

    // Change language
    $scope.currentLanguage =  $translate.use() || $translate.proposedLanguage();
    $scope.changeLanguage = function(newLanguage) {
        $translate.use(newLanguage);
        $localForage.setItem('language', newLanguage);
        $scope.currentLanguage = newLanguage;
    };

    //Change password
    $scope.oldPassword = "";
    $scope.newPassword = "";
    $scope.confirmNewPassword = "";

    $scope.changePassword = function() {

        console.log($scope.oldPassword);
        console.log($scope.newPassword);
        console.log($scope.confirmNewPassword);

        var oldPasswordEncrypted = CryptoJS.SHA256($scope.oldPassword).toString();
        var newPasswordEncrypted = CryptoJS.SHA256($scope.newPassword).toString();
        var confirmPasswordEncrypted = CryptoJS.SHA256($scope.newPassword).toString();

        if($scope.newPassword.length < 8 || $scope.confirmNewPassword.length < 8) {
            utils.showAlert($translate.instant('lowCharPwd'), "Error");
        }
        else if(oldPasswordEncrypted === newPasswordEncrypted) {
            utils.showAlert($translate.instant('repeatedPwd'), "Error");
        } else if(newPasswordEncrypted !== confirmPasswordEncrypted) {
            utils.showAlert($translate.instant('noMatchPwd'), "Error");
        } else {
            var userID = "";
            $localForage.getItem('userID').then(function(response) {
                    userID = response;
                    liveFairApi.changePassword(userID, oldPasswordEncrypted, newPasswordEncrypted).
                        then(function(data) {
                            utils.showAlert(data, "Sucesso");
                        }, function(error) {
                            utils.showAlert($translate.instant('sorryChangePassword'), "Error");
                        }
                    );
                }, function(response) {
                    utils.showAlert($translate.instant('sessionExpired'), "Error");
                    $state.go('menu.home');
                    liveFairApi.logout();
                }
            );
        }
    };

    // Logout
    $scope.logoutUser = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: $translate.instant('logoutConfirmTitle'),
            template: '<p class="text-center">' + $translate.instant('logoutConfirmMessage') + '</p>'
        });
        confirmPopup.then(function(res) {
            if(res) {
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('menu.home');
                liveFairApi.logout();
            }
        });
    };
});