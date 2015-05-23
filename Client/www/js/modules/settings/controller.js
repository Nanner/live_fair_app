var module = angular.module('settingsModule');

module.controller('settingsCtrl', function($rootScope, $scope, $state, $stateParams, liveFairApi, utils, $translate, $localForage, $ionicPopup) {
    $rootScope.isAuthenticated = false;
    $localForage.getItem('isAuthenticated').then(function(result) {
        $rootScope.isAuthenticated = result || false;
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
            //ALL GOOD change password
            liveFairApi.changePassword($scope.standProfileInfo[0].userID, "097c5870-b8fd-db03-f026-7deb9edf9939", newPasswordEnctypted).
                then(function(data) {
                    utils.showAlert(data, "Sucesso");
                    $state.go('menu.profile');
                }, function(error) {
                    liveFairApi.getProfile($scope.standProfileInfo[0].userID).$promise
                        .then(function(profile) {
                            $scope.standProfileInfo = profile;
                            $scope.validate();
                        }, function(error) {
                        });
                    utils.showAlert("Error", "Error");
                });
        }
    };

    $scope.oldPasswordCallback = function() {
        utils.setOldPassword($scope.oldPassword);
    };

    $scope.newPasswordCallback = function() {
        utils.setNewPassword($scope.newPassword);
    };

    $scope.confirmPasswordCallback = function() {
        utils.setConfirmPassword($scope.confirmNewPassword);
    };

    // Logout
    $scope.logoutUser = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: $translate.instant('logoutConfirmTitle'),
            template: '<p class="text-center">' + $translate.instant('logoutConfirmMessage') + '</p>'
        });
        confirmPopup.then(function(res) {
            if(res) {
                $state.go('menu.home');
                liveFairApi.logout();
            }
        });
    };
});