var module = angular.module('registerModule');

module.controller('registerCtrl', function ($scope, $state, $stateParams, utils) {
    
    $scope.usertype = false; //true -> empresa, false -> visitante
    $scope.name = "";
    $scope.lastName = "";
    $scope.username = "";
    $scope.password = "";
    $scope.confirmPassword = "";
    $scope.passwordEncrypted = "";
    $scope.email = "";
    $scope.website = "";
    $scope.phone = "";
    $scope.address = "";
    $scope.termsAcceptance = false;
    
    //validation variables
    $scope.valName = "neutral-icon";
    $scope.valLastname = "neutral-icon";
    $scope.valPassword = "neutral-icon";
    $scope.valConfirmPassword = "neutral-icon";
    $scope.valEmail = "neutral-icon";
    $scope.valWebsite = "neutral-icon";
    $scope.valPhone = "neutral-icon";
    
    var messages = ["Nome próprio só pode conter letras", "Apelido só pode conter letras", "A password tem que ter no mínimo 8 caracteres", "As passwords não correspondem", "Email com formato inválido", "URL do website é inválido", "O seu contacto deve ter 9 digitos", "Por favor preencha todos os campos", "Para prosseguir deverá aceitar os termos de uso"];
    
    var messageToDisplay = [0,0,0,0,0,0,0,0];
    var emptyFields = [1,1,1,1,1,1,1,1,1];
    
    /* Fields validation */
    $scope.validateNamesCallback = function(field) {
        var pattern = /^[A-Za-z]+$/;
        if(field === 'nome') {
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
        else if(field === 'apelido') {
            if($scope.lastName.length === 0) {
                $scope.valLastname = "neutral-icon";
                messageToDisplay[1] = 0;
                emptyFields[1] = 1;
            } else {
                if($scope.lastName.match(pattern)) {
                    $scope.valLastname = "green-icon";
                    messageToDisplay[1] = 0;
                    emptyFields[1] = 0;
                } else {
                    $scope.valLastname = "red-icon";
                    messageToDisplay[1] = 1;
                    emptyFields[1] = 0;
                }
            }
        }
    }
    
    $scope.usernameCallback = function() {
        if($scope.username.length === 0)
            emptyFields[2] = 1;
        else
            emptyFields[2] = 0;
    }
    
    $scope.passwordCallback = function() {
        if($scope.password.length === 0)
            emptyFields[3] = 1;
        else {
            emptyFields[3] = 0;
            if($scope.password.length >= 8) {
                $scope.valPassword = "green-icon";
                messageToDisplay[2] = 0;
            }
            else {
                $scope.valPassword = "red-icon";
                messageToDisplay[2] = 1;
            }
        }
    }
    
    $scope.confirmPasswordCallback = function() {
        if($scope.confirmPassword.length === 0) {
            $scope.valConfirmPassword = "neutral-icon";
            messageToDisplay[2] = 0;
            messageToDisplay[3] = 0;
            emptyFields[4] = 1;
        } else if($scope.confirmPassword.length < 8) {
            $scope.valConfirmPassword = "red-icon";
            messageToDisplay[2] = 1;
            messageToDisplay[3] = 0;
            emptyFields[4] = 0;
        } else if($scope.password === $scope.confirmPassword) {
            $scope.valConfirmPassword = "green-icon";
            messageToDisplay[2] = 0;
            messageToDisplay[3] = 0;
            emptyFields[4] = 0;
        } else {
            $scope.valConfirmPassword = "red-icon";
            messageToDisplay[2] = 0;
            messageToDisplay[3] = 1;
            emptyFields[4] = 0;
        }
    }
    
    $scope.validateEmailCallback = function() {
        var pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
        if($scope.email.length === 0) {
            $scope.valEmail = "neutral-icon";
            messageToDisplay[4] = 0;
            emptyFields[5] = 1;
        } else if($scope.email.match(pattern)) {
            $scope.valEmail = "green-icon";
            messageToDisplay[4] = 0;
            emptyFields[5] = 0;
        } else {
            $scope.valEmail = "red-icon";
            messageToDisplay[4] = 1;
            emptyFields[5] = 0;           
        }
    }
    
    $scope.validateWebsiteCallback = function() {
        var pattern = /^(http(?:s)?\:\/\/[a-zA-Z0-9]+(?:(?:\.|\-)[a-zA-Z0-9]+)+(?:\:\d+)?(?:\/[\w\-]+)*(?:\/?|\/\w+\.[a-zA-Z]{2,4}(?:\?[\w]+\=[\w\-]+)?)?(?:\&[\w]+\=[\w\-]+)*)$/;
        
        if($scope.website.length === 0) {
            $scope.valWebsite = "neutral-icon";
            messageToDisplay[5] = 0;
            emptyFields[6] = 1;
        } else if($scope.website.match(pattern)) {
            $scope.valWebsite = "green-icon";
            messageToDisplay[5] = 0;
            emptyFields[6] = 0;
        } else {
            $scope.valWebsite = "red-icon";
            messageToDisplay[5] = 1;
            emptyFields[6] = 0;
        }
    }
    
    $scope.validatePhoneCallback = function() {
        var pattern = /^\d{9}$/;
        if($scope.phone.length === 0) {
            $scope.valPhone = "neutral-icon";
            messageToDisplay[6] = 0;
            emptyFields[7] = 1;
        } else if($scope.phone.match(pattern)) {
            $scope.valPhone = "green-icon";
            messageToDisplay[6] = 0;
            emptyFields[7] = 0;
        } else {
            $scope.valPhone = "red-icon";
            messageToDisplay[6] = 1;
            emptyFields[7] = 0;
        }
    }
    
    $scope.validateAddressCallback = function() {
        if($scope.address.length === 0)
            emptyFields[8] = 1;
        else
            emptyFields[8] = 0;
    }
    
     $scope.submitRegister = function() {
         var existsEmptyField = false;
         var existsNotValidField = false;
         
         if($scope.usertype === true) { //empresa
            emptyFields[1] = 0;
         } else { //visitante
            emptyFields[6] = 0;
            emptyFields[8] = 0;
         }
             
         for(var i = 0; i < emptyFields.length; i++) {
             if(emptyFields[i] === 1) {
                 existsEmptyField = true;
                 console.log("Empty field: " + i);
                 utils.showAlert(messages[7], 'Informação errada');
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
                utils.showAlert(messages[8], 'Termos de uso'); 
            } else {
                var passwordEncrypted = CryptoJS.SHA256($scope.password).toString();
                console.log(passwordEncrypted);
                console.log("all good, time to submit");   
            }
         }
    }
    
});