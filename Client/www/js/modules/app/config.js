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
	})
    .state('menu.register', {
		url: "/register",
		views: {
			'menuContent' :{
				templateUrl: "templates/register.html",
				controller: "registerCtrl"
			}
		}
	})
    .state('menu.fair', {
		url: "/fair",
		views: {
			'menuContent' :{
				templateUrl: "templates/fair.html",
				controller: "fairCtrl"
			}
		}
	})
    .state('menu.listfairs',{
        url: "/listfairs",
        views:{
            'menuContent' :{
                templateUrl: "templates/listfairs.html",
                controller: "listFairsCtrl"
            }
        }
    })
    .state('menu.presentStands', {
		url: "/presentStands",
		views: {
			'menuContent' :{
				templateUrl: "templates/presentStands.html",
				controller: "presentStrandCtrl"
			}
		}
	})
	.state('menu.fairProgram', {
		url: "/fairprogram",
		views: {
			'menuContent' :{
				templateUrl: "templates/fairProgram.html",
				controller: "fairProgramCtrl"
			}
		}
	})
	.state('menu.profile', {
		url: "/profile",
		views: {
			'menuContent' :{
				templateUrl: "templates/profile.html",
				controller: "profileCtrl"
			}
		}
	});
    
    //Default startup screen
    $urlRouterProvider.otherwise("/menu/login");
}); 