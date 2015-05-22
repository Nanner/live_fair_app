var module = angular.module('starter');

module.config(function($stateProvider, $urlRouterProvider, $translateProvider, $compileProvider, $httpProvider) {

	$httpProvider.interceptors.push('authInterceptor');

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
		'attendingStands': 'Stands presentes',
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
		'socialNetworksLogin': 'Entrar com LinkedIn',
		'saveChanges': 'Guardar alterações',
		'subject': 'Assunto',
		'location': 'Localização',
		'local': 'Local',
		'programDay': 'Dia do evento:',
		'search': 'Pesquisa',
		'filterByDate': 'Filter by date',
		'startDate': 'Data início',
		'endDate': 'Data Fim',
		'searchLocation': 'Localização',
		'speakers': 'Oradores',
		'noInterests': 'O organizador ainda não definiu a lista de interesses para este evento',
		'noEvents': 'Não existem eventos agendados proximamente',
		'noStands': 'Não existem ainda stands confirmados',
		'noLiveFairs': 'Não foi encontrada nenhuma live fair',
		'failedToResolve': "Falha a ligar ao servidor, por favor verifique a sua ligação à rede.",
		'register-usertype': "Sou uma empresa",
		'submit': "Submeter",
		"editInterests": "Editar interesses",
		"changePassword": "Alterar a password",
		"newPassword": "Password nova",
		"oldPassword": "Password antiga",
		"stats": "Estatísticas",
		"matches": "Matches",
		"matchpercentage": "Percentagem de matches",
		"clicks": "Cliques",
		"contactsEstablished": "Contactos estabelecidos",
		"popKeywords": "Keywords mais populares",
        'upcomingFairs' : 'Próximas feiras',
        'sortByDate' : 'Data',
        'termsAndConditions' : 'Termos & Condições'
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
		'socialNetworksLogin': 'Login with LinkedIn',
		'saveChanges': 'Save changes',
		'subject': 'Subject',
		'location': 'Location',
		'local': 'Location',
		'programDay': 'Select day:',
		'search': 'Search',
		'filterByDate': 'Filtrar por data',
		'startDate': 'Start date',
		'endDate': 'End Date',
		'searchLocation': 'Location',
		'speakers': 'Speakers',
		'noInterests': 'The interest list has not been defined yet',
		'noEvents': 'Currently, there are no scheduled events',
		'noStands': 'Currently, no attending stand has been confirmed',
		'noLiveFairs': 'No live fairs were found',
		'failedToResolve': 'Failed to connect to the server, please check your network connection.',
		'register-usertype': 'I\'m a company',
		'submit': "Submit",
		"editInterests": "Edit interests",
		"changePassword": "Change password",
		"newPassword": "New password",
		"oldPassword": "Password antiga",
		"stats": "Statistics",
		"matches": "Matches",
		"matchpercentage": "Match percentage",
		"clicks": "Clicks",
		"contactsEstablished": "Established contacts",
		"popKeywords": "Most popular keywords",
        'upcomingFairs' : 'Upcoming Fairs',
        'sortByDate' : 'Date',
        'termsAndConditions' : 'Terms & Conditions'
	});

	$translateProvider.preferredLanguage('pt');

	//camera stuff
	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
}); 