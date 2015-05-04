// Creatte all your modules with no dependencies
angular.module('homeModule', []);
angular.module('loginModule', []);
angular.module('registerModule', []);
angular.module('profileModule', []);
angular.module('fairModule', []);

// Lastly, create your "main" module and inject all other modules as dependencies
angular.module('starter',
    [
        'homeModule',
        'loginModule',
        'registerModule',
        'profileModule',
        'fairModule',
        'ionic',
        'ngCordova',
        'ngResource',
        'pascalprecht.translate'
    ]
);