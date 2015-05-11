var Hapi = require('hapi');
var Good = require('good');
var Yar = require('yar');

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
require('./routes/visitor')(server);

server.register({
    register: require('yar'),
        options: {
            cookieOptions: {
                password: 'password'
            }
        }
    }, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }    
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
