var module = angular.module('fairModule');

module.controller('listFairsCtrl', function ($scope, liveFairApi) {
	$scope.fairs = liveFairApi.getLiveFairs();
	
});