var Hapi = require('hapi');
var Good = require('good');

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
        throw err;
    }

    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
