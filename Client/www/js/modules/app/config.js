var module = angular.module('starter');

module.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider
    .state('menu', {
		url: "/menu",
		abstract: true,
		views: {
			'applicationContent' :{
				templateUrl: "templates/menu.html",
				controller: "toogleCtrl"
			}
		}
	})
	.state('menu.login', {
		url: "/login",
		views: {
			'menuContent' :{
				templateUrl: "templates/login.html",
				controller: "loginCtrl"
			}
		}
	});
    
    //Default startup screen
    $urlRouterProvider.otherwise("/menu/login");
});