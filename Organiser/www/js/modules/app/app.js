// Creatte all your modules with no dependencies
angular.module('configModule', []);
angular.module('homeModule', []);
angular.module('loginModule', []);
angular.module('registerModule', []);
angular.module('profileModule', []);
angular.module('fairModule', []);
angular.module('bootstrap-tagsinput', []);

// Lastly, create your "main" module and inject all other modules as dependencies
angular.module('starter',
    [
        'configModule',
        'homeModule',
        'loginModule',
        'registerModule',
        'profileModule',
        'fairModule',
        'ionic',
        'bootstrap-tagsinput',
        'ngCordova',
        'ngResource',
        'http-auth-interceptor'
    ]
);