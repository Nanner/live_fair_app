var module = angular.module('starter');

module.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

	$httpProvider.interceptors.push('authInterceptor');

	$stateProvider
		.state('home', {
			url: "/home",
			views: {
				'appContent' :{
					templateUrl: "templates/home.html",
					controller: "homeCtrl"
				}
			}
		})
		.state('login', {
			url: "/login",
			views: {
				'appContent' :{
					templateUrl: "templates/login.html",
					controller: "loginCtrl"
				}
			}
		})
		/*.state('menu.register', {
			url: "/register",
			views: {
				'menuContent' :{
					templateUrl: "templates/register.html",
					controller: "registerCtrl"
				}
			}
		})
		.state('menu.listfairs',{
			url: "/fairs",
			views:{
				'menuContent' :{
					templateUrl: "templates/listfairs.html",
					controller: "listFairsCtrl"
				}
			},
			resolve: {
				listfairs: function(liveFairApi, $stateParams) {
					return liveFairApi.getLiveFairs().$promise
						.then(function(liveFairs) {
							return liveFairs;
						}, function(error) {
							return "failed to resolve";
						});
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
		.state('menu.fairStands', {
			url: "/fairs/:fairID/stands",
			views: {
				'menuContent' :{
					templateUrl: "templates/fairStands.html",
					controller: "fairStandsCtrl"

				}
			}
		})
		.state('menu.fairProgram', {
			url: "/fairs/:fairID/program",
			views: {
				'menuContent' :{
					templateUrl: "templates/fairProgram.html",
					controller: "fairProgramCtrl"
				}
			},
			resolve: {
				schedule: function(liveFairApi, $stateParams) {
					return liveFairApi.getLiveFairSchedule($stateParams.fairID).$promise
						.then(function(schedule) {
							return schedule;
						}, function(error) {
							return "failed to resolve";
						});
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
		})
		.state('menu.editProfile', {
			url: "/editProfile",
			views: {
				'menuContent' :{
					templateUrl: "templates/editProfile.html",
					controller: "profileCtrl"
				}
			}
		})
		.state('menu.companyStats', {
			url: "/companyStats",
			views: {
				'menuContent' :{
					templateUrl: "templates/companyStats.html",
					controller: "profileCtrl"
				}
			}
		})
		.state('menu.fairTest', {
			url: "/fair",
			views: {
				'menuContent': {
					templateUrl: "templates/fair.html",
					controller: "fairCtrl"
				}
			}
		})
		.state('menu.fair', {
			url: "/fairs/:fairID",
			views: {
				'menuContent' :{
					templateUrl: "templates/fair.html",
					controller: "fairCtrl"
				}
			}
		})
		.state('menu.searchFairs', {
			url: "/searchFairs",
			views: {
				'menuContent' :{
					templateUrl: "templates/searchFairs.html",
					controller: "searchFairCtrl"
				}
			}
		})*/;

	//Default startup screen
	$urlRouterProvider.otherwise("/login");
}).
controller('routeController', ['$scope', '$location', function($scope, $location) {
    $scope.showPageLogin = $location.path() === '/login';
    console.log($location.path())
  }]);