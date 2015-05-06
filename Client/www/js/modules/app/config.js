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

	//Activate variable content escaping (for more security)
	$translateProvider.useSanitizeValueStrategy('escaped');

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
		'place': 'Local',
		'adherence': 'Adesão',
		'chooseInterests': 'Escolha os seus intereses',
		'select': 'Selecionar',
		'menuFair': 'Feira',
		'menuFairs': 'Feiras',
        'de': 'de',
        'a': 'a',
        'e': 'e',
        'attendingStands': 'Stands Presentes',
        'info': 'Informações',
        'webpage': 'Página Web',
        'aboutus': 'Sobre nós',
        'phone': 'Telefone',
        'interests': 'Interesses',
        'btnRecomendedStands': 'Ver stands recomendados',
        'btnStandEvents': 'Ver eventos deste stand',
        'saveContact': 'Guardar contacto',
        'sync': 'Sync',
        'cancel': 'Cancelar',
        'recoverPassword': 'Recuperar password',
        'socialNetworksLogin': 'Entrar com facebook'
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
		'terms': 'Declare that read and accept the terms', 
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
		'place': 'Place',
		'adherence': 'Adherence',
		'chooseInterests': 'Choose your interests',	
		'select': 'Submit',
		'menuFair': 'Fair',
		'menuFairs': 'Fairs',
        'de': 'from',
        'a': 'to',
        'e': 'and',
        'attendingStands': 'Attending stands',
        'info': 'Infomations',
        'webpage': 'Webpage',
        'aboutus': 'About us',
        'phone': 'Telephone',
        'interests': 'Interests',
        'btnRecomendedStands': 'Consult recommended stands',
        'btnStandEvents': 'Consult stand\'s events',
        'saveContact': 'Save contact',
        'sync': 'Sync',
        'cancel': 'Cancel',
        'recoverPassword': 'Recover password',
        'socialNetworksLogin': 'Login with facebook'
	});

	$translateProvider.preferredLanguage('pt');

}); 