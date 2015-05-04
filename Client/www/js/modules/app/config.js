var module = angular.module('starter');

module.config(function($stateProvider, $urlRouterProvider, $translateProvider) {

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
		.state('menu.home', {
			url: "/home",
			views: {
				'menuContent' :{
					templateUrl: "templates/home.html",
					controller: "homeCtrl"
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
		})
		.state('menu.fair', {
			url: "/fair",
			views: {
				'menuContent' :{
					templateUrl: "templates/fair.html",
					controller: "fairCtrl"
				}
			}
		});

	//Default startup screen
	$urlRouterProvider.otherwise("/menu/home");

	//dealing with languages
	$translateProvider.translations('pt', {
		'existingUser': 'Utilizador existente?',
		'enter': 'Entrar',
		'register': 'Registar',
		'enterAsVisitor': 'Entrar como visitante',
		'user': 'Utilizador',
		'name': 'Nome',
		'confPassword': 'Confirmação password',
		'address': 'Morada',
		'terms': 'Declaro que li e aceito os termos',
		'listfairs': 'Lista de Feiras',
		'date': 'Data',
		'opening': 'Abertura',
		'em': 'em',
		'ending': 'Encerramento',
		'description': 'Descrição',
		'btnProgram': 'Ver programa da feira',
		'btnStands': 'Ver stands presentes',
		'btnAderir': 'Aderir',
		'program': 'Programa',
		'hours': 'Horas',
		'events': 'Eventos',
		'starting': 'Início',
		'ending': 'Fim',
		'place': 'Local',
		'adherence': 'Adesão',
		'chooseInterests': 'Escolha os seus intereses',
		'select': 'Selecionar',
		'menuFair': 'Feira',
		'menuFairs': 'Feiras'
	});

	$translateProvider.translations('en', {
		'existingUser': 'Already a member?',
		'enter': 'Login',
		'register': 'Register',
		'enterAsVisitor': 'Enter as visitor',
		'user': 'User',
		'name': 'Name',
		'confPassword': 'Confirm Password',
		'address': 'Address',
		'terms': 'I declare that i read and accept the terms', 
		'listfairs': 'Fairs List',
		'date': 'Date',
		'opening': 'Opening time',
		'em': 'in',
		'ending': 'Closing time',
		'description': 'Description',
		'btnProgram': 'Consult fair program',
		'btnStands': 'Consult attending stands',
		'btnAderir': 'Subscribe',
		'program': 'Program',
		'hours': 'Hours',
		'events': 'Events',
		'starting': 'Start time',
		'ending': 'Ending time',
		'place': 'Place',
		'adherence': 'Adherence',
		'chooseInterests': 'Choose your interests',	
		'select': 'Submit',
		'menuFair': 'Fair',
		'menuFairs': 'Fairs'
	});

	$translateProvider.preferredLanguage('pt');

}); 