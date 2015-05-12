var Hapi = require('hapi');
var Good = require('good');
var Auth = require('hapi-auth-cookie');

var server = new Hapi.Server({
    connections: {
        routes: {
            cors: true
        }
    }
});

server.connection({ port: 3000 });

server.app.models = require('./models');

require('./routes/liveFair')(server);
require('./routes/user')(server);
require('./routes/visitor')(server);

//server.register(Auth, function (err) {
//
//    server.auth.default('session', 'cookie',true, {
//        scheme: 'cookie',
//        password: 'diogoeumteamleadermaisoumenos',
//        cookie: 'alettuceeporreira',
//        clearInvalid: true,
//        isSecure: false
//    });
//});

server.register({
    register: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*',
                log: '*'
            }
        }]
    }
}, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
