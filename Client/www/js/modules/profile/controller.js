var module = angular.module('profileModule');

module.controller('profileCtrl', function ($scope, $state, $stateParams, $ionicPopup, $translate, $localStorage, $localForage, server, utils, contacts, camera, liveFairApi) {

    if($stateParams.fairID) {
        $scope.fairID = $stateParams.fairID;
    }
    if($stateParams.companyID) {
        $scope.companyID = $stateParams.companyID;
    }

    $scope.existsWebsite = true;
    $scope.standProfileInfo = "";

    $scope.saveContact = function() {
        var userID = "";
        $localForage.getItem('userID').then(function(response) {
                userID = response;
                if(!userID) {
                    contacts.addContact($scope.standProfileInfo[1].companyName, $scope.standProfileInfo[0].contact, $scope.standProfileInfo[0].email, $scope.standProfileInfo.website, $scope.standProfileInfo[1].address);
                    utils.showAlert($translate.instant('addedContact'), $translate.instant('success'));
                } else {
                    liveFairApi.IncrementContact(userID, $scope.standProfileInfo[1].companyID).$promise
                        .then(function(profile) {
                            contacts.addContact($scope.standProfileInfo[1].companyName, $scope.standProfileInfo[0].contact, $scope.standProfileInfo[0].email, $scope.standProfileInfo.website, $scope.standProfileInfo[1].address);
                            utils.showAlert($translate.instant('addedContact'), $translate.instant('success'));
                        }, function(error) {} 
                    );
                }
            }, function(response) {
                utils.showAlert($translate.instant('notOpenOwnProfile'), "Error");
                $state.go('menu.listfairs');
            }
        );
    };

    //EditProfile validation variables
    $scope.valName = "neutral-icon";
    $scope.valEmail = "neutral-icon";
    $scope.valWebsite = "neutral-icon";
    $scope.valAddress = "neutral-icon";
    $scope.valPhone = "neutral-icon";

    //Change password
    $scope.oldPassword = "";
    $scope.newPassword = "";
    $scope.confirmNewPassword = "";
    $scope.interestsList = "";
    $scope.imgSource = "";

    var messages = [$translate.instant('registerNameOnlyLetters'), $translate.instant('registerEmailInvalid'), $translate.instant('registerUrlInvalid'), $translate.instant('profilePhoneValidation'), $translate.instant('registerFillEverything')];
    var messageToDisplay = [0,0,0,0,0];
    var emptyFields = [1,1,1,1];

    $scope.loadProfile = function(type) {
        utils.showLoadingPopup();
        var profileID = $stateParams.companyID;
        liveFairApi.getProfile(profileID).$promise
            .then(function(profile) {
                $localForage.setItem("profile_" + profileID, profile).then(function() {
                    $scope.imgSource = server.url + "/Users/" + profileID +"/image";
                    $scope.standProfileInfo = profile;
                    $scope.failedToResolve = false;
                    $scope.checkIfWebsiteIsAvailable();
                    if(type == "own") {
                        $scope.initEmptyField();
                        $scope.checkIfOwner(profileID);
                    } else if(type == "nown") {
                        $scope.fetchCompanyInterests(profileID);
                    }
                    utils.hideLoadingPopup();
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }, function(error) {
                $localForage.getItem("profile_" + profileID).then(function(profile) {
                    if(profile) {
                        $scope.imgSource = server.url + "/Users/" + profileID +"/image";
                        $scope.standProfileInfo = profile;
                        $scope.failedToResolve = false;
                        $scope.checkIfWebsiteIsAvailable();
                        if(type == "own") {
                            $scope.initEmptyField();
                            $scope.checkIfOwner(profileID);
                        } else if(type == "nown") {
                            $scope.fetchCompanyInterests(profileID);
                        }
                        utils.hideLoadingPopup();
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                    else {
                        $scope.failedToResolve = true;
                        utils.hideLoadingPopup();
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                }, function(error) {
                    $scope.failedToResolve = true;
                    utils.hideLoadingPopup();
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }
        );
    };

    $scope.fetchCompanyInterests = function(companyID) {
        var fairID = $stateParams.fairID;
        utils.showLoadingPopup();
        liveFairApi.getCompanyInterests(fairID, companyID).$promise
            .then(function(interests) {
                $localForage.setItem('interests_' + fairID + "_" + companyID, interests).then(function(){
                    $scope.failedToResolve = false;
                    $scope.interestsList = interests;
                    utils.hideLoadingPopup();
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }, function(error) {
                $localForage.getItem('interests_' + fairID + "_" + companyID).then(function(interests) {
                    if(interests) {
                        $scope.failedToResolve = false;
                        $scope.interestsList = interests;
                        utils.hideLoadingPopup();
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                    else {
                        $scope.failedToResolve = true;
                        $scope.interestsList = [];
                        utils.hideLoadingPopup();
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                }, function(error) {
                    $scope.failedToResolve = true;
                    $scope.interestsList = [];
                    utils.hideLoadingPopup();
                    $scope.$broadcast('scroll.refreshComplete');
                })
            }
        );
    }

    $scope.checkIfOwner = function(profileID) {
        var accountID = "";
        $localForage.getItem('userID').then(function(response) {
                accountID = response;
                if(profileID != accountID) {
                    utils.showAlert($translate.instant('notOpenOwnProfile'), "Permission Denied");
                    $state.go('menu.listfairs');
                }
            }, function(response) {
                utils.showAlert($translate.instant('notOpenOwnProfile'), "Error");
                $state.go('menu.listfairs');
            }
        );
    }

    $scope.initEmptyField = function() {
        if(! $scope.standProfileInfo[1].companyName || $scope.standProfileInfo[1].companyName === null) {
            $scope.standProfileInfo[1].companyName = "";
        } if(! $scope.standProfileInfo[0].email || $scope.standProfileInfo[0].email === null) {
            $scope.standProfileInfo[0].email = "";
        } if(! $scope.standProfileInfo[1].website || $scope.standProfileInfo[1].website === null) {
            $scope.standProfileInfo[1].website = "";
        } if(! $scope.standProfileInfo[1].address || $scope.standProfileInfo[1].address === null) {
            $scope.standProfileInfo[1].address = "";
        } if(! $scope.standProfileInfo[0].contact || $scope.standProfileInfo[0].contact === null) {
            $scope.standProfileInfo[0].contact = "";
        } if(! $scope.standProfileInfo[1].logoImage || $scope.standProfileInfo[1].logoImage === null) {
            $scope.standProfileInfo[1].logoImage = "";
        } if(! $scope.standProfileInfo[0].description || $scope.standProfileInfo[0].description === null) {
            $scope.standProfileInfo[0].description = "";
        }
    }

    $scope.checkIfWebsiteIsAvailable = function() {
        if(! $scope.standProfileInfo[1].website || $scope.standProfileInfo[1].website === null) {
            $scope.existsWebsite = false;
        } else {
            var pattern = /^(http(?:s)?\:\/\/[a-zA-Z0-9]+(?:(?:\.|\-)[a-zA-Z0-9]+)+(?:\:\d+)?(?:\/[\w\-]+)*(?:\/?|\/\w+\.[a-zA-Z]{2,4}(?:\?[\w]+\=[\w\-]+)?)?(?:\&[\w]+\=[\w\-]+)*)$/;
            if($scope.standProfileInfo[1].website.match(pattern)) {
                $scope.existsWebsite = true;
            } else {
                $scope.existsWebsite = false;
            }
        }
    }

    $scope.editProfile = function() {
        utils.setProfileInfo($scope.standProfileInfo);
        $state.go('menu.editProfile');
    }

    $scope.validateFields = function() {
        $scope.standProfileInfo = utils.getProfileInfo();
        $scope.validateNameCallback();
        $scope.validateEmailCallback();
        $scope.validateWebsiteCallback();
        $scope.validateAddressCallback();
        $scope.validatePhoneCallback();
    }

    $scope.validate = function() {
        $scope.initEmptyField();
        $scope.validateNameCallback();
        $scope.validateEmailCallback();
        $scope.validateWebsiteCallback();
        $scope.validateAddressCallback();
        $scope.validatePhoneCallback();
    }

    $scope.validateNameCallback = function() {
        var pattern = /^[A-Za-z][A-Za-z -]*[A-Za-z]$/;
        if($scope.standProfileInfo[1].companyName.length === 0) {
            $scope.valName = "neutral-icon";
            messageToDisplay[0] = 0;
            emptyFields[0] = 1;
        } else {
            if($scope.standProfileInfo[1].companyName.match(pattern)) {
                $scope.valName = "green-icon";
                messageToDisplay[0] = 0;
                emptyFields[0] = 0;
            } else {
                $scope.valName = "red-icon";
                messageToDisplay[0] = 1;
                emptyFields[0] = 0;
            }
        }
    }

    $scope.validateEmailCallback = function() {
        var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if($scope.standProfileInfo[0].email.length === 0) {
            $scope.valEmail = "neutral-icon";
            messageToDisplay[1] = 0;
            emptyFields[1] = 1;
        } else if($scope.standProfileInfo[0].email.match(pattern)) {
            $scope.valEmail = "green-icon";
            messageToDisplay[1] = 0;
            emptyFields[1] = 0;
        } else {
            $scope.valEmail = "red-icon";
            messageToDisplay[1] = 1;
            emptyFields[1] = 0;
        }
    }

    $scope.validateWebsiteCallback = function() {
        var pattern = /^((http(?:s)?\:\/\/)?[a-zA-Z0-9]+(?:(?:\.|\-)[a-zA-Z0-9]+)+(?:\:\d+)?(?:\/[\w\-]+)*(?:\/?|\/\w+\.[a-zA-Z]{2,4}(?:\?[\w]+\=[\w\-]+)?)?(?:\&[\w]+\=[\w\-]+)*)$/;
        if($scope.standProfileInfo[1].website.length === 0) {
            $scope.valWebsite = "neutral-icon";
            messageToDisplay[2] = 0;
            emptyFields[2] = 1;
        } else if($scope.standProfileInfo[1].website.match(pattern)) {
            $scope.valWebsite = "green-icon";
            messageToDisplay[2] = 0;
            emptyFields[2] = 0;
        } else {
            $scope.valWebsite = "red-icon";
            messageToDisplay[2] = 1;
            emptyFields[2] = 0;
        }
    }

    $scope.validateAddressCallback = function() {
        if($scope.standProfileInfo[1].address.length === 0) {
            $scope.valAddress = "red-icon";
            emptyFields[3] = 1;
        } else {
            $scope.valAddress = "green-icon";
            emptyFields[3] = 0;
        }
    }

    $scope.validatePhoneCallback = function() {
        var pattern = /(^\+\d{12}$)|(^\d{9,10}$)/;
        if($scope.standProfileInfo[0].contact.length === 0) {
            $scope.valPhone = "neutral-icon";
            messageToDisplay[3] = 0;
        } else if($scope.standProfileInfo[0].contact.toString().match(pattern)) {
            $scope.valPhone = "green-icon";
            messageToDisplay[3] = 0;
        } else {
            $scope.valPhone = "red-icon";
            messageToDisplay[3] = 1;
        }
    }

    $scope.uploadPhoto = function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,// gets base64-encoded image
            //destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 200,
            targetHeight: 200,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            mediaType: Camera.MediaType.ALLMEDIA
        };

        camera.getPicture().then(function(result) {
            alert(result);
            //$scope.standProfileInfo.logo = result; //commented because .css is not adjusting the new image correctly
        }, function(err) {
            console.err(err);
        });
    }

    $scope.incrementCounter = function(id) {
        liveFairApi.incrementCounter($scope.fairID, id);
    }

    $scope.saveChanges = function() {
        var existsEmptyField = false;
        var existsNotValidField = false;

        for(i = 0; i < emptyFields.length; i++) {
            if(emptyFields[i] === 1) {
                existsEmptyField = true;
                utils.showAlert(messages[4], 'Informação errada');
                break;
            }
        }

        if(!existsEmptyField) {
            for(i = 0; i < messageToDisplay.length; i++) {
                if(messageToDisplay[i] === 1) {
                    existsNotValidField = true;
                    utils.showAlert(messages[i], 'Informação errada');
                    break;
                }
            }
        }

        if(!existsEmptyField && !existsNotValidField) {
            liveFairApi.editProfile($scope.standProfileInfo[0].userID, $scope.standProfileInfo[1].companyName, $scope.standProfileInfo[0].description, $scope.standProfileInfo[0].contact, $scope.standProfileInfo[1].address, $scope.standProfileInfo[0].email, $scope.standProfileInfo[1].website).
                then(function(data) {
                    utils.showAlert($translate.instant('successfulEditProfile'), $translate.instant('success'));
                    $state.go("menu.ownProfile", {companyID: $scope.standProfileInfo[0].userID});
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

    $scope.loadEvents = function(fairID, companyID) {
        $state.go("menu.standProgram", {fairID: fairID, companyID: companyID});
    };
});

module.controller('statisticsCtrl', function ($scope, $state, $stateParams, $localForage, liveFairApi, utils, _) {
    var liveFairID = $stateParams.fairID;
    var companyID = "";
    $scope.websiteVisitors = "";
    $scope.matches = "";
    $scope.likes = "";
    $scope.contactsEstablished = "";

    $localForage.getItem('userID').then(function(response) {
            companyID = response;
            liveFairApi.getCompanyWebsiteVisitors(liveFairID, companyID).then(function(webVisitors) {
                $scope.websiteVisitors = webVisitors[1];
                liveFairApi.getCompanyMatchesStats(liveFairID, companyID).then(function(match) {
                        $scope.matches = match;
                        var matchCounts = match[0];
                        $scope.matches[0] = _.sortBy(matchCounts, function(e) {
                            return e.count;
                        })
                            .reverse();
                        liveFairApi.getCompanyLikes(liveFairID, companyID).then(function(likes) {
                                $scope.likes = likes[0].count;
                                liveFairApi.getContactsEstablished(liveFairID, companyID).then(function(contacts) {
                                        $scope.contactsEstablished = contacts[0].count;
                                    }, function(error) {
                                        console.log(error);
                                    }
                                );
                            }, function(error) {
                                console.log(error);
                            }
                        );
                    }, function(error) {
                        console.log(error);
                    }
                );
            }, function(error) {
                console.log(error);
            });
        }, function(response) {
            utils.showAlert($translate.instant('sessionExpired'), $translate.instant('error'));
            $state.go('menu.home');
            liveFairApi.logout();
        }
    );
});