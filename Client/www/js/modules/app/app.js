// Creatte all your modules with no dependencies
angular.module('loginModule', []);
angular.module('registerModule', []);
angular.module('profileModule', []);
angular.module('fairModule', []);

// Lastly, create your "main" module and inject all other modules as dependencies
angular.module('starter',
  [
    'loginModule',
    'registerModule',
    'profileModule',
    'fairModule',
    'ionic',
    'ngCordova'
  ]
);