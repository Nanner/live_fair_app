var module = angular.module('profileModule');

module.controller('profileCtrl', function ($scope, $state, $stateParams, $ionicPopup, $translate, $localStorage, $localForage, utils, contacts, camera, liveFairApi) {
    
    $scope.existsWebsite = true;
    $scope.standProfileInfo = "";
    $scope.statsScreen = {name: "Amt consulting", matches: 120, matchPercentage: 67, clicks: 50, contatsEstablished: 35, keywords:[{name: 'Informática', nmatches: 80},{name: 'Empreendedorismo', nmatches: 50}]};

    $scope.saveContact = function() {
        contacts.addContact($scope.standProfileInfo[1].companyName, $scope.standProfileInfo[0].contact, $scope.standProfileInfo[0].email, $scope.standProfileInfo.website, $scope.standProfileInfo[1].address);
        alert("Contacto adicionado");
    }

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

    var messages = ["Nome só pode conter letras", "Email com formato inválido", "URL do website é inválido", "O contacto deve ter 9 digitos", "Por favor preencha todos os campos"];
    var messageToDisplay = [0,0,0,0,0];
    var emptyFields = [1,1,1,1];

    $scope.loadProfile = function(type) {
        var profileID = $stateParams.companyID;
        liveFairApi.getProfile(profileID).$promise
            .then(function(profile) {
                $scope.standProfileInfo = profile;
                $scope.failedToResolve = false;
                $scope.checkIfWebsiteIsAvailable();
                if(type == "own") {
                    $scope.initEmptyField();
                    $scope.checkIfOwner(profileID);
                }
            }, function(error) {
                $scope.failedToResolve = true; 
        });
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
        var pattern = /^(http(?:s)?\:\/\/[a-zA-Z0-9]+(?:(?:\.|\-)[a-zA-Z0-9]+)+(?:\:\d+)?(?:\/[\w\-]+)*(?:\/?|\/\w+\.[a-zA-Z]{2,4}(?:\?[\w]+\=[\w\-]+)?)?(?:\&[\w]+\=[\w\-]+)*)$/;     
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
        liveFairApi.incrementCounter(id);
    }

    $scope.openStats = function() {
        $state.go('menu.companyStats');
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
                    utils.showAlert(data, "Sucesso");
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
    }
});