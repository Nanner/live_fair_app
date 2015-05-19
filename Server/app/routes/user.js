var Promise = require("bluebird");
var crypto = require("crypto");
var uuid = require('node-uuid');
var Joi = require('joi');
var fs = require('fs');

var sequelize = require('../models').sequelize;

var User = require('../models').User;

var Company = require('../models').Company;
var Visitor = require('../models').Visitor;
var Organizer = require('../models').Organizer;
var Boom = require('boom');

var RegisterSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().min(8).max(20).required(),
    tipo: Joi.string().regex(/visitor|company|organizer/).required(),
    address: Joi.string(),
    website: Joi.string().regex(/^(http(?:s)?\:\/\/[a-zA-Z0-9]+(?:(?:\.|\-)[a-zA-Z0-9]+)+(?:\:\d+)?(?:\/[\w\-]+)*(?:\/?|\/\w+\.[a-zA-Z]{2,4}(?:\?[\w]+\=[\w\-]+)?)?(?:\&[\w]+\=[\w\-]+)*)$/),
    companyName: Joi.string()
});

var EditSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    contact: Joi.string().regex(/(^\+\d{12}$)|(^\d{9,10}$)/).required(),
    address: Joi.string().required(),
    website: Joi.string().regex(/^(http(?:s)?\:\/\/[a-zA-Z0-9]+(?:(?:\.|\-)[a-zA-Z0-9]+)+(?:\:\d+)?(?:\/[\w\-]+)*(?:\/?|\/\w+\.[a-zA-Z]{2,4}(?:\?[\w]+\=[\w\-]+)?)?(?:\&[\w]+\=[\w\-]+)*)$/).required(),
    companyName: Joi.string().required(),
    description:Joi.string()
});

var ChangePasswordSchema = Joi.object().keys({
    password: Joi.string().alphanum().min(8).max(20).required()
});

module.exports = function(server){

    server.route({
        method: 'GET',
        path: '/logout',
        config:{
            auth: {
               strategy: 'token'
           },
        handler: function (request, reply) {
            request.auth.session.clear();
            return JSON.stringify('Logout bem sucedido');
        }}
    });

    server.route({
        method: 'POST',
        path: '/register',
        config:{
            auth: {
                mode: 'optional',
               strategy: 'token'
           },
        handler: function(request, reply) {
            return sequelize.transaction(function(t) {
                var Schematest={
                    email:request.payload.email,
                    password:request.payload.password,
                    tipo:request.payload.type
                };
                if(request.payload.address)
                    Schematest['address']=request.payload.address;

                if(request.payload.companyName)
                    Schematest['companyName']=request.payload.companyName;

                if(request.payload.website)
                    Schematest['website']=request.payload.website;

                var validate = Joi.validate(Schematest,RegisterSchema);

                if(validate.error!==null){
                    throw new Error('Missing critical fields');
                }
                else{
                    var passHash=crypto.createHash('sha512');
                    var ID=uuid.v4();
                    passHash.update(request.payload.password);
                    return User.create({
                        'userID':ID,
                        'email':Schematest.email,
                        'password':passHash.digest('hex'),
                        'type':Schematest.tipo
                    }, {transaction: t})
                        .then(function(user) {
                            switch (Schematest.tipo){
                                case 'company':
                                    var obj = {
                                        'companyID':user.userID,
                                        'visitorCounter': 0
                                    };

                                    if(Schematest.address)
                                        obj['address']=Schematest.address;

                                    if(Schematest.companyName)
                                        obj['companyName']=Schematest.companyName;

                                    if(Schematest.website)
                                        obj['website']=Schematest.website;

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
        }}
    });
    
    server.route({
        method: 'GET',
        path: '/Users/{UserID}',
        config:{
            auth: {
                mode: 'optional',
               strategy: 'token'
           },
        handler: function (request, reply) {
            var UserID = request.params.UserID;
            User.find({where:
                {
                    userID: UserID
                }}).then(function(UserProfile)
            {
                switch(UserProfile.type){
                    case 'visitor':
                        Visitor.find({where:
                        {
                            visitorID: UserID
                        }}).then(function(VisitorProfile) {
                            reply (JSON.stringify([UserProfile,VisitorProfile]));
                        });
                        break;
                    case 'company':
                        Company.find({where:
                        {
                            companyID: UserID
                        }}).then(function(CompanyProfile) {
                            reply (JSON.stringify([UserProfile,CompanyProfile]));
                        });
                        break;
                    case 'organizer':
                        Organizer.find({where:
                        {
                            organizerID: UserID
                        }}).then(function(OrganizerProfile) {
                            reply (JSON.stringify([UserProfile,OrganizerProfile]));
                        }); 
                        break;
                }
            });
        }}
    });
    
    server.route({
        method: ['GET','POST'],
        path: '/Users/{UserID}/update',
        config:{
            auth: {
               strategy: 'token'
           },
        handler: function (request, reply) {
            var UserID = request.params.UserID;
            if (request.method === 'post') {
                
                var Schematest={
                    email:request.payload.email,
                    contact:request.payload.contact,
                    address:request.payload.address,
                    website:request.payload.website,
                    companyName:request.payload.companyName,
                    description:request.payload.description
                };
                
                var validate = Joi.validate(Schematest,EditSchema);
                
                return sequelize.transaction(function(t) {
                if(validate.error!==null){
                    throw new Error('Missing critical fields');
                }
                else{
                    return User.update({
                        'email':request.payload.email,
                        'description':request.payload.description,
                        'contact':request.payload.contact
                    }, {transaction: t,
                        where:{
                            userID : UserID
                        }})
                        .then(function(user) {

                           return Company.update({
                               'companyName':request.payload.companyName,
                                'address':request.payload.address,
                                'website':request.payload.website,
                           }, {transaction: t,
                           where:{
                               companyID: UserID
                           }});

                        });
                }})
                .then(function(result) {
                    reply(JSON.stringify('Alteração Registo Bem Sucedida'));
                })
                .catch(function(error) {
                    reply(Boom.badRequest(error.message));
                });
        }
        else if (request.method === 'get') {
            
            User.find({where:
                {
                    userID: UserID
                }}).then(function(UserProfile)
            {
              Company.find({where:
              {
                  companyID: UserID
              }}).then(function(CompanyProfile) {
                   reply (JSON.stringify([UserProfile,CompanyProfile]));
              });
                
            }).catch(function(error) {
                return reply(Boom.badRequest(error));
            });
        }
        }}
    });
    
    server.route({
        method: 'POST',
        path: '/Users/{UserID}/update/password',
        config:{
            auth: {
               strategy: 'token'
           },
        handler: function (request, reply) {
            var validateSchema={password:request.payload.password};
            var result=validateSchema.validate();
            if(result.error!==null){
                    throw new Error('Missing critical fields');
            }
            else{
                var UserID = request.params.UserID;
                var passHash=crypto.createHash('sha512');
                var oldPassHash=crypto.createHash('sha512');
                passHash.update(request.payload.password);
                reply(User.update({
                    'password':passHash.digest('hex')
                },{
                    where:{
                        userID:UserID,
                        password:oldPassHash.digest('hex')
                    }
                })).catch(function(error) {
                    reply(Boom.badRequest(error.message));
                });
            }
        }}
    });
    
    server.route({
        method: 'POST',
        path: '/Users/{UserID}/update/image',
         config:{
            auth: {
               strategy: 'token'
           },
            handler: function (request, reply) {
            if(!request.payload.image || !request.payload.imageName){
               throw new Error('Missing critical fields');
            }
            else{
                var UserID = request.params.UserID;
                reply (Company.update({
                    'logoImage':request.payload.imageName
                },{
                    where:{
                        companyID:UserID
                    }
                }).then(function(company){
                    console.log("teste");
                    fs.writeFile("./images/"+request.payload.imageName,request.payload.image,function(err){
                        if(err)
                        {
                            return Boom.badRequest(err.message);
                        }
                            
                    });
                    return JSON.stringify('Ficheiro Guardado com sucesso');
                }).catch(function(error) {
                    reply(Boom.badRequest(error.message));
                }));
            }
        }}
    });
    
    server.route({
        method: 'POST',
        path: '/Users/{CompanyID}/counter',
         config:{
            auth: {
               mode: 'optional',
               strategy: 'token'
           },
            handler: function (request, reply) {
                var CompanyID = request.params.CompanyID;
                reply (Company.find({where:{
                   companyID:CompanyID
                }}).then(function(company){
                    Company.update({
                       'visitorCounter':company.visitorCounter+1
                    },{where:{
                        companyID:CompanyID
                    }});
                })
                );
           }}
    });
};
