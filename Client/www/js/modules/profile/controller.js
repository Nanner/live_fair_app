var module = angular.module('profileModule');

module.controller('profileCtrl', function ($scope, $state, $stateParams, $ionicPopup, $translate, utils, contacts, camera, liveFairApi) {
    
    $scope.profileOwner = true;
    $scope.standProfileInfo = {id: "06be5ca6-9993-7e3a-ce6c-3efd89e6cae4", name: "Amt Consulting", logo: "img/Amt consulting.png", website: "http://www.amt-consulting.pt/", description: "Campo opcional que deverá conter uma espécie de About us", phone: 210174833, email: "amatteroftrust@amt-consulting.com", address: "Avenida Tomás Ribeiro n43 Bloco 2A Piso 4E"};

    $scope.saveContact = function() {
        contacts.addContact($scope.standProfileInfo.name, $scope.standProfileInfo.phone, $scope.standProfileInfo.email, $scope.standProfileInfo.website, $scope.standProfileInfo.address);
        alert("Contacto adicionado"); //temporário
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

    $scope.editProfile = function() {
    	$state.transitionTo('menu.editProfile', $stateParams, { reload: true, inherit: false, notify: true });
    }

    $scope.validateFields = function() {
    	$scope.validateNameCallback();
    	$scope.validateEmailCallback();
    	$scope.validateWebsiteCallback();
    	$scope.validateAddressCallback();
    	$scope.validatePhoneCallback();
    }

    $scope.validateNameCallback = function() {
        var pattern = /^[A-Za-z][A-Za-z -]*[A-Za-z]$/;
        if($scope.standProfileInfo.name.length === 0) {
            $scope.valName = "neutral-icon";
            messageToDisplay[0] = 0;
            emptyFields[0] = 1;
        } else {
            if($scope.standProfileInfo.name.match(pattern)) {
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
        if($scope.standProfileInfo.email.length === 0) {
            $scope.valEmail = "neutral-icon";
            messageToDisplay[1] = 0;
            emptyFields[1] = 1;
        } else if($scope.standProfileInfo.email.match(pattern)) {
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
        if($scope.standProfileInfo.website.length === 0) {
            $scope.valWebsite = "neutral-icon";
            messageToDisplay[2] = 0;
            emptyFields[2] = 1;
        } else if($scope.standProfileInfo.website.match(pattern)) {
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
        if($scope.standProfileInfo.address.length === 0) {
            $scope.valAddress = "red-icon";
            emptyFields[3] = 1;
        } else {
            $scope.valAddress = "green-icon";
            emptyFields[3] = 0;
        }
    } 

    $scope.validatePhoneCallback = function() {
    	var pattern = /(^\+\d{12}$)|(^\d{9,10}$)/;
    	if($scope.standProfileInfo.phone.length === 0) {
    		$scope.valPhone = "neutral-icon";
    		messageToDisplay[3] = 0;
    	} else if($scope.standProfileInfo.phone.toString().match(pattern)) {
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

    $scope.changePassword = function() {
        var myPopup = $ionicPopup.show({
            templateUrl: "templates/changePassword.html",
            title: $translate.instant('changePassword'),
            scope: $scope,
            buttons: [
                { text: $translate.instant('cancel') },
                {
                    text: '<b>' + $translate.instant('submit') + '</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        //verificar se password actual corresponde
                        //fazer pedido ao servidor para mudar password
                        console.log("tapped submit button");
                    }
                }
            ]
        });
    }

    $scope.incrementCounter = function(id) {
        liveFairApi.incrementCounter(id);
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
        	//all good make request to the server
        	console.log($scope.standProfileInfo);
        }
    }

});