var module = angular.module('profileModule');

module.controller('profileCtrl', function ($scope, $state, $stateParams, contacts) {
    
    $scope.standProfileInfo = {name: "Amt Consulting", logo: "img/Amt consulting.png", website: "http://www.amt-consulting.pt/", description: "Campo opcional que deverá conter uma espécie de About us", phone: 210174833, email: "amatteroftrust@amt-consulting.com", address: "Avenida Tomás Ribeiro n43 Bloco 2A Piso 4E", interestsList: [{name: "Informática"}, {name: "Electrotécnica"}, {name: "Empreendedorismo"}]};
    
    $scope.saveContact = function() {
        contacts.addContact($scope.standProfileInfo.name, $scope.standProfileInfo.phone, $scope.standProfileInfo.email, $scope.standProfileInfo.website, $scope.standProfileInfo.address);
        alert("fim");
    }

});
