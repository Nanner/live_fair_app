var Promise = require("bluebird");
var crypto = require("crypto");

var User = require('../models').User;

module.exports = function(server){
    server.route({
        method: 'POST',
        path: '/login',
        config:{
            handler: function (request, reply) {
                if (request.auth.isAuthenticated) {
                    return reply.redirect('/');
                }
                
                var message = '';
                var account = null;
                
                if (request.method === 'post') {

        if (!request.payload.username ||
            !request.payload.password) {

            message = 'Missing username or password';
        }
        else {
            account = User.find({where:
                {
                    email: request.payload.username
                }});
                var hash = crypto.createHash('sha512');
                hash.update(account.password);
            if (!account ||
                hash.digest() !== request.payload.password) {

                message = 'Invalid username or password';
            }
        }
    }

        request.auth.session.set(account);
        return reply.redirect('/');
    
            },
            plugins: {
              'hapi-auth-cookie': {
              redirectTo: false
            }
         }
    }
    });
    
    server.route({
        method: 'GET',
        path: '/logout',
        handler: function (request, reply) {
            request.auth.session.clear();
            return reply.redirect('/');
        }
    });
};