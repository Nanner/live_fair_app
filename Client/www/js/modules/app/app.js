// Define all your modules with no dependencies
angular.module('loginModule', []);

// Lastly, define your "main" module and inject all other modules as dependencies
angular.module('starter',
  [
    'loginModule',
    'ionic'
  ]
);