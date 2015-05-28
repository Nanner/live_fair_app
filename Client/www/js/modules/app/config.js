var module = angular.module('starter');

module.config(function($stateProvider, $urlRouterProvider, $translateProvider, $compileProvider, $httpProvider, jwtInterceptorProvider) {

	jwtInterceptorProvider.tokenGetter = function($localStorage) {
        return $localStorage.get('token');
    };

    $httpProvider.interceptors.push('jwtInterceptor');

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
			url: "/home/:loggedOut",
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
			},
			cache: false
		})
		.state('menu.register', {
			url: "/register",
			views: {
				'menuContent' :{
					templateUrl: "templates/register.html",
					controller: "registerCtrl"
				}
			},
			cache: false
		})
		.state('menu.listfairs',{
			url: "/fairs",
			views:{
				'menuContent' :{
					templateUrl: "templates/listfairs.html",
					controller: "listFairsCtrl"
				}
			}
		})
		.state('menu.matches',{
			url: "/fairs/:fairID/matches",
			views:{
				'menuContent' :{
					templateUrl: "templates/matches.html",
					controller: "fairMatchesCtrl"
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
							console.log(schedule);
							return schedule;
						}, function(error) {
							return "failed to resolve";
						});
				}
			}
		})
		.state('menu.profile', {
			url: "/fairs/:fairID/stands/:companyID",
			views: {
				'menuContent' :{
					templateUrl: "templates/profile.html",
					controller: "profileCtrl"
				}
			},
			cache: false
		})
		.state('menu.standProgram', {
			url: "/fairs/:fairID/stands/:companyID/program",
			views: {
				'menuContent' :{
					templateUrl: "templates/standProgram.html",
					controller: "standProgramCtrl"
				}
			},
			resolve: {
				schedule: function(liveFairApi, $stateParams, $localForage) {
					return liveFairApi.getLiveFairStandSchedule($stateParams.fairID, $stateParams.companyID).$promise
						.then(function(schedule) {
							return $localForage.setItem("schedule_" + $stateParams.fairID + "_" + $stateParams.companyID, schedule)
								.then(function() {
									return schedule;
								});
						}, function(error) {
							return $localForage.getItem("schedule_" + $stateParams.fairID + "_" + $stateParams.companyID)
								.then(function(schedule) {
									return schedule;
								}, function(error) {
									return "failed to resolve";
								});
						});
				}
			}
		})
		.state('menu.ownProfile', {
			url: "/companies/:companyID",
			views: {
				'menuContent' :{
					templateUrl: "templates/ownProfile.html",
					controller: "profileCtrl"
				}
			},
			cache: false
		})
		.state('menu.editProfile', {
			url: "/editProfile",
			views: {
				'menuContent' :{
					templateUrl: "templates/editProfile.html",
					controller: "profileCtrl"
				}
			},
			cache: false
		})
		.state('menu.companyStats', {
			url: "/companyStats/:fairID",
			views: {
				'menuContent' :{
					templateUrl: "templates/companyStats.html",
					controller: "statisticsCtrl"
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
			},
			cache: false
		})
		.state('menu.searchFairs', {
			url: "/searchFairs",
			views: {
				'menuContent' :{
					templateUrl: "templates/searchFairs.html",
					controller: "searchFairCtrl"
				}
			}
		})
		.state('menu.settings', {
			url: "/settings",
			views: {
				'menuContent' :{
					templateUrl: "templates/settings.html",
					controller: "settingsCtrl"
				}
			},
			cache: false
		})
		.state('menu.createStandEvent', {
			url: "/fairs/:fairID/stands/:companyID/createEvent",
			views: {
				'menuContent' :{
					templateUrl: "templates/createStandEvent.html",
					controller: 'createStandEventCtrl'
				}
			},
			cache: false
		});

	//Default startup screen
	$urlRouterProvider.otherwise("/menu/home/");

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
		'chooseInterests': 'Escolha as suas áreas de interesse',
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
		'interests': 'Áreas de Interesse',
		'btnRecomendedStands': 'Ver stands recomendados',
		'btnStandEvents': 'Ver eventos deste stand',
		'btnOwnStandEvents' : 'Ver eventos',
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
		'filterByDate': 'Filtrar por data',
		'clean': 'Limpar',
		'startDate': 'Data de início',
		'endDate': 'Data de fim',
		'searchLocation': 'Localização',
		'speakers': 'Oradores',
		'noInterests': 'O organizador ainda não definiu a lista de interesses para este evento',
		'noEvents': 'Não existem eventos agendados proximamente',
		'noStands': 'Não existem ainda stands confirmados',
		'noLiveFairs': 'Não foi encontrada nenhuma live fair',
		'failedToResolve': "Falha a ligar ao servidor, por favor verifique a sua ligação à rede.",
		'register-usertype': "Sou uma empresa",
		'submit': "Submeter",
		"editInterests": "Editar áreas de interesse",
		"changePassword": "Alterar a password",
		"newPassword": "Password nova",
		"oldPassword": "Password antiga",
		"stats": "Estatísticas",
		"matches": "Matches",
		"matchpercentage": "Percentagem de matches",
		"clicks": "Cliques",
		"contactsEstablished": "Contactos estabelecidos",
		"popKeywords": "Keywords mais populares",
        'fairInformation' : 'Informação',
        'presentStands' : 'Stands',
        'suggestedStands' : 'Matches',
		'upcomingFairs' : 'Próximas feiras',
		'sortByDate' : 'Data',
		'termsAndConditions' : 'Termos & Condições',
		'lowCharPwd': 'A password deve conter no mínimo 8 caracteres',
		'noMatchPwd': 'As passwords não correspondem',
		'repeatedPwd': 'A nova password não pode ser igual à password antiga',
		'ownNoContact': 'Ainda não forneceu o seu contacto',
		'ownNoAboutUs': 'Ainda não preencheu a sua descrição',
		'ownNoAddress': 'Ainda não preencheu a sua morada',
		'lackInfoCompany': 'Esta empresa não se encontra a partilhar esta informação consigo',
		'settings' : 'Definições',
		'language' : 'Idioma',
		'profile' : 'Perfil',
		'logout' : "Terminar sessão",
		'loggedOutPopupTitle' : "Sessão terminada com sucesso",
		'loggedOutPopupMessage' : "Volte sempre!",
		'logoutConfirmTitle': "Terminar a sessão",
		'logoutConfirmMessage' : "Deseja realmente terminar a sessão?",
		'notOpenOwnProfile': "Lamentamos mas não foi possível abrir o seu perfil",
		'eventsForCompany' : "Eventos agendados por:",
		'loggedInAs' : "Autenticado como",
		'sessionExpired': "A sua sessão expirou",
		'sorryChangePassword': "Unfortunately password could not be changed",
		"erroSubscribeLiveFair": "Ocorreu um erro enquanto aderia à feira",
		'createEvent': "Criar evento",
		'createStandEvent': 'Criar evento de stand',
		'newEvent': "Novo evento",
		'btnAddStandEvent': "Novo evento",
		'btnCreate': "Criar",
		'btnConfirmChanges': "Confirmar alterações",
		'startTime': "Hora de início",
		'endTime' : "Hora de fim",
		'btnNoAderir': "Cancelar adesão",
		'pwwdChangedSuccess': "Password alterada com sucesso",
		'successfulEventCreationTitle': "Sucesso",
		'successfulEventCreationMessage': "Evento criado com sucesso!",
		'unsuccessfulEventCreationTitle': "Lamentamos",
		'unsuccessfulEventCreationMessage': "Criação de evento falhou. Por favor tente novamente mais tarde",
		'processingPopup': "A processar...",
		'notPossibleMatches' : "Não foi possível mostrar os seus matches",
		'fairList': "Listagem de feiras",
		'searchFairs': "Pesquisa",
		'ownProfile': "Meu perfil",
		'details': "Informações",
		'fairProgram': "Programa",
		'fairProfile': "Perfil da feira",
		'homeScreen': "Início",
		'login': "Iniciar sessão",
		'registration': "Registo",
		'standProgram': "Programação de stand"
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
		'chooseInterests': 'Choose your interest areas',
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
		'interests': 'Interest Areas',
		'btnRecomendedStands': 'Consult recommended stands',
		'btnStandEvents': 'Consult stand\'s events',
		'btnOwnStandEvents' : 'Consult events',
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
		'filterByDate': 'Filter by date',
		'clean': 'Clear',
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
		"editInterests": "Edit interest areas",
		"changePassword": "Change password",
		"newPassword": "New password",
		"oldPassword": "Previous password",
		"stats": "Statistics",
		"matches": "Matches",
		"matchpercentage": "Match percentage",
		"clicks": "Clicks",
		"contactsEstablished": "Established contacts",
		"popKeywords": "Most popular keywords",
        'fairInformation' : 'Information',
        'presentStands' : 'Stands',
        'suggestedStands' : 'Matches',
		'upcomingFairs' : 'Upcoming Fairs',
		'sortByDate' : 'Date',
		'termsAndConditions' : 'Terms & Conditions',
		'lowCharPwd': 'Password must contain at least 8 characters',
		'noMatchPwd': 'Password do not correspond',
		'repeatedPwd': 'New password must not be the same as the last one',
		'ownNoContact': 'You have not filled your contact',
		'ownNoAboutUs': 'You have not filled the About you',
		'ownNoAddress': 'You have not filled your address',
		'lackInfoCompany': 'This company have not shared this information with you',
		'settings' : "Settings",
		'language' : "Language",
		'profile' : "Profile",
		'logout' : "Logout",
		'loggedOutPopupTitle' : "Successfully logged out",
		'loggedOutPopupMessage' : "Come back anytime!",
		'logoutConfirmTitle': "Confirm logout",
		'logoutConfirmMessage' : "Are you sure you want to logout of your account?",
		'notOpenOwnProfile': "An error occured and it was no possible to load your profile",
		'eventsForCompany' : "Events scheduled by:",
		'loggedInAs' : "Logged in as",
		'sessionExpired': "Session Expired",
		'sorryChangePassword': "Unfortunately password could not be changed",
		"erroSubscribeLiveFair": "An error have occured while subscribing the fair",
		'createEvent': "Create event",
		'createStandEvent': 'Create stand event',
		'btnAddStandEvent': "New event",
		'newEvent': "New event",
		'btnCreate': "Create",
		'btnConfirmChanges': "Confirm changes",
		'startTime': "Start time",
		'endTime' : "End time",
		'btnNoAderir': "Cancel subscription",
		'pwwdChangedSuccess': "Password changed successfully",
		'successfulEventCreationTitle': "Success",
		'successfulEventCreationMessage': "Event successfully created",
		'unsuccessfulEventCreationTitle': "We're sorry",
		'unsuccessfulEventCreationMessage': "Event creation failed. Please try again later",
		'processingPopup': "Processing...",
		'notPossibleMatches' : "It was not possible to show you mathces",
		'fairList' : "Fair listing",
		'searchFairs': "Search",
		'ownProfile': "My profile",
		'details': "Details",
		'fairProgram': "Program",
		'fairProfile': "Fair profile",
		'homeScreen': "Home",
		'login': "Login",
		'registration': "Registration",
		'standProgram': "Stand program"
	});

	$translateProvider.useLocalStorage();
	$translateProvider.preferredLanguage('en');

	//camera stuff
	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
});
