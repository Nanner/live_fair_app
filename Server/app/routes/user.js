var Promise = require("bluebird");
var crypto = require("crypto");
var uuid = require('node-uuid');

var User = require('../models').User;

module.exports = function(server){

    server.route({
        method: 'GET',
        path: '/logout',
        handler: function (request, reply) {
            request.auth.session.clear();
            return JSON.stringify('Logout bem sucedido');
        }
    });
    
    server.route({
       method: 'POST',
       path: '/register',
       handler: function(request,reply){
           if(!request.payload.email || !request.payload.password || !request.payload.type){
               reply(JSON.stringify('Missing critical fields'));
           }
           else{
               var passHash=crypto.createHash('sha512');
               passHash.update(request.payload.password);
               User.create({
                   'userID':uuid.v4(),
                    'email':request.payload.email,
                    'password':passHash.digest(),
                    'type':request.payload.type
                    } 
               );
              reply(JSON.stringify('Registo Bem Sucedido'));
           }
       }     
    });
};