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
    $scope.password = [];
    $scope.password.oldPassword = "";
    $scope.password.newPassword = "";
    $scope.password.confirmNewPassword = "";

    $scope.changePassword = function() {

        console.log($scope.password.oldPassword);
        console.log($scope.password.newPassword);
        console.log($scope.password.confirmNewPassword);

        var oldPasswordEncrypted = CryptoJS.SHA256($scope.password.oldPassword).toString();
        var newPasswordEncrypted = CryptoJS.SHA256($scope.password.newPassword).toString();
        var confirmPasswordEncrypted = CryptoJS.SHA256($scope.password.newPassword).toString();

        if($scope.password.newPassword.length < 8 || $scope.password.confirmNewPassword.length < 8) {
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

    $scope.testPicas = function() {
        console.log("Valha-me deus");
        console.log($scope.password.oldPassword);
        console.log($scope.password.newPassword);
        console.log($scope.password.confirmNewPassword);
        console.log("puta que pariu");
    }

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