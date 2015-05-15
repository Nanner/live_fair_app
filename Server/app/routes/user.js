var Promise = require("bluebird");
var crypto = require("crypto");
var uuid = require('node-uuid');

var User = require('../models').User;

var Company = require('../models').Company;
var Visitor = require('../models').Visitor;
var Organizer = require('../models').Organizer;

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
               var ID=uuid.v4();
               passHash.update(request.payload.password);
               User.create({
                   'userID':ID,
                    'email':request.payload.email,
                    'password':passHash.digest(),
                    'type':request.payload.type
                    } 
               );
              reply(JSON.stringify('Registo Bem Sucedido'));
              
              switch (request.payload.type){
                  case 'company':
                        Company.Create({
                            'companyID':ID,
                            'visitorCounter': 0
                        });
                        break;
                  case 'visitor':
                        Visitor.Create({
                           'visitorID':ID 
                        });
                        break;
                  case 'organizer':
                        Organizer.Create({
                           'visitorID':ID 
                        });
                        break;
              }
           }
       }     
    });
};