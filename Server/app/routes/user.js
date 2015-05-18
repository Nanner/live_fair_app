var Promise = require("bluebird");
var crypto = require("crypto");
var uuid = require('node-uuid');

var sequelize = require('../models').sequelize;

var User = require('../models').User;

var Company = require('../models').Company;
var Visitor = require('../models').Visitor;
var Organizer = require('../models').Organizer;
var Boom = require('boom');

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
        handler: function(request, reply) {
            return sequelize.transaction(function(t) {
                if(!request.payload.email || !request.payload.password || !request.payload.type){
                    throw new Error('Missing critical fields');
                }
                else{
                    var passHash=crypto.createHash('sha512');
                    var ID=uuid.v4();
                    passHash.update(request.payload.password);
                    return User.create({
                        'userID':ID,
                        'email':request.payload.email,
                        'password':passHash.digest('hex'),
                        'type':request.payload.type
                    }, {transaction: t})
                        .then(function(user) {
                            switch (request.payload.type){
                                case 'company':
                                    var obj = {
                                        'companyID':user.userID,
                                        'visitorCounter': 0
                                    };

                                    if(request.payload.address)
                                        obj['address']=request.payload.address;

                                    if(request.payload.companyName)
                                        obj['companyName']=request.payload.companyName;

                                    if(request.payload.website)
                                        obj['website']=request.payload.website;

                                    return Company.create(obj, {transaction: t});

                                    break;
                                case 'visitor':
                                    return Visitor.create({
                                        'visitorID':user.userID
                                    }, {transaction: t});

                                    break;
                                case 'organizer':
                                    return Organizer.create({
                                        'organizerID':user.userID
                                    }, {transaction: t});

                                    break;
                            }
                        });
                }})
                .then(function(result) {
                    reply(JSON.stringify('Registo Bem Sucedido'));
                })
                .catch(function(error) {
                    reply(Boom.badRequest(error.message));
                });
        }
    });
    
    server.route({
        method: 'GET',
        path: '/Users/{UserID}',
        handler: function (request, reply) {
            var UserID = request.params.UserID;
            User.find({where:
                {
                    userID: UserID
                }}).then(function(UserProfile)
            {
                console.log(UserProfile.type);
                switch(UserProfile.type){
                    case 'visitor':
                        Visitor.find({where:
                        {
                            visitorID: UserID
                        }}).then(function(VisitorProfile) {
                            console.log(VisitorProfile);
                            reply (JSON.stringify([UserProfile,VisitorProfile]));
                        });
                        break;
                    case 'company':
                        Company.find({where:
                        {
                            companyID: UserID
                        }}).then(function(CompanyProfile) {
                            console.log(CompanyProfile);
                            reply (JSON.stringify([UserProfile,CompanyProfile]));
                        });
                        break;
                    case 'organizer':
                        Organizer.find({where:
                        {
                            organizerID: UserID
                        }}).then(function(OrganizerProfile) {
                            console.log(OrganizerProfile);
                            reply (JSON.stringify([UserProfile,OrganizerProfile]));
                        }); 
                        break;
                }
            });
        }
    });
    
    server.route({
        method: 'GET',
        path: '/Users/{UserID}/update',
        handler: function (request, reply) {
            var UserID = request.params.UserID;
            User.find({where:
                {
                    userID: UserID
                }}).then(function(UserProfile)
            {
                console.log(UserProfile.type);
                switch(UserProfile.type){
                    case 'visitor':
                        Visitor.find({where:
                        {
                            visitorID: UserID
                        }}).then(function(VisitorProfile) {
                            console.log(VisitorProfile);
                            reply (JSON.stringify([UserProfile,VisitorProfile]));
                        });
                        break;
                    case 'company':
                        Company.find({where:
                        {
                            companyID: UserID
                        }}).then(function(CompanyProfile) {
                            console.log(CompanyProfile);
                            reply (JSON.stringify([UserProfile,CompanyProfile]));
                        });
                        break;
                    case 'organizer':
                        Organizer.find({where:
                        {
                            organizerID: UserID
                        }}).then(function(OrganizerProfile) {
                            console.log(OrganizerProfile);
                            reply (JSON.stringify([UserProfile,OrganizerProfile]));
                        }); 
                        break;
                }
            });
        }
    });
};