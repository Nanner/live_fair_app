var Hapi = require('hapi');
var Good = require('good');
var Auth = require('hapi-auth-cookie');
var Bell = require('bell');
var crypto = require("crypto");

var User = require('./models').User;

var server = new Hapi.Server({
    connections: {
        routes: {
            cors: true
        }
    }
});

server.connection({ port: 3000 });

server.app.models = require('./models');

require('./routes/login')(server);
require('./routes/liveFair')(server);
require('./routes/user')(server);
require('./routes/stats')(server);

server.register(Auth, function (err) {

    server.auth.strategy('session', 'cookie', {
        password: 'diogoeumteamleadermaisoumenos',
        cookie: 'alettuceeporreira',
        clearInvalid: true,
        isSecure: false
    });
});

server.register(require('bell'), function (err) {
    server.auth.strategy('linkedin', 'bell', {
        provider: 'linkedin',
        password: 'urgenteeimportante',
        clientId: '775mjt71aumg8s',
        clientSecret: 'iF2CbG7rWD4thwWk',
        isSecure: false
    });
});

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

//server.route({
//    method: 'POST',
//    path: '/login',
//    config:{
//        auth: {
//            mode: 'try',
//            strategy: 'session'
//        },
//        handler: function (request, reply) {
//
//            if (request.method === 'post') {
//                if (!request.payload.username ||
//                    !request.payload.password) {
//                    reply(JSON.stringify('Missing username or password'));
//                }
//                else {
//                    User.find({where:
//                    {
//                        email: request.payload.username
//                    }}).then(function(account) {
//                        if(!account) {
//                            reply(JSON.stringify('Invalid username or password'));
//                        }
//                        else {
//                            var hash = crypto.createHash('sha512');
//                            hash.update(account.password);
//                            if (account.password !== request.payload.password) {
//                                reply(JSON.stringify('Invalid username or password'));
//                            }
//                            else {
//                                var cookie = crypto.createHash('sha512'),temp;
//                                cookie.update(account.email+new Date().toString());
//                                temp=cookie.digest('base64');
//                                request.auth.session.set(account);
//                                request.auth.session.set(account.userID,temp);
//                                reply(JSON.stringify(temp));
//                            }
//                        }
//                    });
//                }
//            }
//
//        },
//        plugins: {
//            'hapi-auth-cookie': {
//                redirectTo: false
//            }
//        }
//    }
//});

server.route({
    method: '*',
    path: '/login/linkedin',
    config: {
        auth: 'linkedin',
        handler: function (request, reply) {

            reply('<pre>' + JSON.stringify(request.auth.credentials, null, 4) + '</pre>');
        }
    }
});