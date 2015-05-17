var module = angular.module('registerModule');

module.controller('registerCtrl', function ($scope, $state, $stateParams, utils, liveFairApi) {
    
    $scope.isCompany = false;
    $scope.usertype = false; //true -> empresa, false -> visitante
    $scope.name = "";
    $scope.password = "";
    $scope.confirmPassword = "";
    $scope.passwordEncrypted = "";
    $scope.mail = "";
    $scope.website = "";
    $scope.address = "";
    $scope.termsAcceptance = true;
    
    //validation variables
    $scope.valName = "neutral-icon";
    $scope.valPassword = "neutral-icon";
    $scope.valConfirmPassword = "neutral-icon";
    $scope.valEmail = "neutral-icon";
    $scope.valWebsite = "neutral-icon";
    $scope.valAddress = "neutral-icon";
    
    var messages = ["Nome só pode conter letras", "A password tem que ter no mínimo 8 caracteres", "As passwords não correspondem", "Email com formato inválido", "URL do website é inválido", "Por favor preencha todos os campos", "Para prosseguir deverá aceitar os termos de uso", "Lamentamos mas não foi possível realizar o registo com sucesso"];
    
    var messageToDisplay = [0,0,0,0,0,0,0,0];
    var emptyFields = [1,1,1,1,1,1];
    
    /* Fields validation */
    $scope.validateNameCallback = function() {
        var pattern = /^[A-Za-z][A-Za-z -]*[A-Za-z]$/;
        if($scope.name.length === 0) {
            $scope.valName = "neutral-icon";
            messageToDisplay[0] = 0;
            emptyFields[0] = 1;
        } else {
            if($scope.name.match(pattern)) {
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
    
    $scope.passwordCallback = function() {
        if($scope.password.length === 0) {
            $scope.valPassword = "neutral-icon";
            emptyFields[1] = 1;
        }
        else {
            emptyFields[1] = 0;
            if($scope.password.length >= 8) {
                $scope.valPassword = "green-icon";
                messageToDisplay[1] = 0;
            }
            else {
                $scope.valPassword = "red-icon";
                messageToDisplay[1] = 1;
            }
        
            if($scope.confirmPassword.length > 0) {
                $scope.confirmPasswordCallback();
            }
        }
    }
    
    $scope.confirmPasswordCallback = function() {
        if($scope.confirmPassword.length === 0) {
            $scope.valConfirmPassword = "neutral-icon";
            messageToDisplay[1] = 0;
            messageToDisplay[2] = 0;
            emptyFields[2] = 1;
        } else if($scope.confirmPassword.length < 8) {
            $scope.valConfirmPassword = "red-icon";
            messageToDisplay[1] = 1;
            messageToDisplay[2] = 0;
            emptyFields[2] = 0;
        } else if($scope.password === $scope.confirmPassword) {
            $scope.valConfirmPassword = "green-icon";
            messageToDisplay[1] = 0;
            messageToDisplay[2] = 0;
            emptyFields[2] = 0;
        } else {
            $scope.valConfirmPassword = "red-icon";
            messageToDisplay[1] = 0;
            messageToDisplay[2] = 1;
            emptyFields[2] = 0;
        }
    }
    
    $scope.validateEmailCallback = function() {
        var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        if(!$scope.mail || $scope.mail.length === 0) {
            $scope.valEmail = "neutral-icon";
            messageToDisplay[3] = 0;
            emptyFields[3] = 1;
        } else if($scope.mail.match(pattern)) {
            $scope.valEmail = "green-icon";
            messageToDisplay[3] = 0;
            emptyFields[3] = 0;
        } else {
            $scope.valEmail = "red-icon";
            messageToDisplay[3] = 1;
            emptyFields[3] = 0;           
        }
    }
    
    $scope.validateWebsiteCallback = function() {
        var pattern = /^(http(?:s)?\:\/\/[a-zA-Z0-9]+(?:(?:\.|\-)[a-zA-Z0-9]+)+(?:\:\d+)?(?:\/[\w\-]+)*(?:\/?|\/\w+\.[a-zA-Z]{2,4}(?:\?[\w]+\=[\w\-]+)?)?(?:\&[\w]+\=[\w\-]+)*)$/;     
        if($scope.website.length === 0) {
            $scope.valWebsite = "neutral-icon";
            messageToDisplay[4] = 0;
            emptyFields[4] = 1;
        } else if($scope.website.match(pattern)) {
            $scope.valWebsite = "green-icon";
            messageToDisplay[4] = 0;
            emptyFields[4] = 0;
        } else {
            $scope.valWebsite = "red-icon";
            messageToDisplay[4] = 1;
            emptyFields[4] = 0;
        }
    }
    
    $scope.validateAddressCallback = function() {
        if($scope.address.length === 0) {
            $scope.valAddress = "red-icon";
            emptyFields[5] = 1;
        }
        else {
            $scope.valAddress = "green-icon";
            emptyFields[5] = 0;
        }
    }

    $scope.userTypeChanged = function() { //reload current state
        console.log("Mudar usertype: " + $scope.isCompany);
        utils.setUserType($scope.isCompany);
        //Falta fazer refresh ao ecra ASAP
    }

    $scope.fetchUsertype = function() {
        console.log("Registo: " + utils.getUsertype());
        $scope.isCompany = utils.getUsertype();
        $scope.usertype = utils.getUsertype();
    }
    
     $scope.submitRegister = function() {
         var existsEmptyField = false;
         var existsNotValidField = false;
         
         if($scope.usertype !== true) { //visitante
            emptyFields[0] = 0;
            emptyFields[4] = 0;
            emptyFields[5] = 0;
         } 

         for(var i = 0; i < emptyFields.length; i++) {
             if(emptyFields[i] === 1) {
                 existsEmptyField = true;
                 utils.showAlert(messages[5], 'Informação errada');
                 break;
             }
         }
         
         if(!existsEmptyField) {
            for(var i = 0; i < messageToDisplay.length; i++) {
                if(messageToDisplay[i] === 1) {
                    existsNotValidField = true;
                    utils.showAlert(messages[i], 'Informação errada');
                    break;
                }
            }
         }
         
         if(!existsNotValidField && !existsEmptyField) {
            if(!$scope.termsAcceptance) {
                utils.showAlert(messages[6], 'Termos de uso'); 
            } else {
                var passwordEncrypted = CryptoJS.SHA256($scope.password).toString();
                console.log(passwordEncrypted);
                console.log("all good, time to submit");

                var usertype = "";
                if($scope.usertype)
                    usertype = 'company';
                else
                    usertype = 'visitor';

                liveFairApi.register($scope.mail, passwordEncrypted, usertype, $scope.address, $scope.name, $scope.website).
                    then(function(data) {
                        utils.showAlert(data, "Sucesso");
                        $state.go('menu.login');
                    }, function(error) {
                        utils.showAlert(messages[7], "Erro");
                }); 
            }
         }
    }
    
});