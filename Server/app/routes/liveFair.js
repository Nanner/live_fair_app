var Promise = require("bluebird");
var Boom = require("boom");
var sequelize = require('../models').sequelize;
var uuid = require('node-uuid');
var Joi = require('joi');

var LiveFair = require('../models').LiveFair;
var LiveFairEvents = require('../models').LiveFairEvents;
var CompanyEvents = require('../models').CompanyEvents;
var Stands = require('../models').Stands;
var Users = require('../models').User;
var Company = require('../models').Company;
var Visitor= require('../models').Visitor;
var Interest = require('../models').Interest;
var LiveFairInterest = require('../models').LiveFairInterest;
var VisitorLiveFair = require('../models').VisitorLiveFair;
var LiveFairCompanyInterest = require('../models').LiveFairCompanyInterest;
var LiveFairVisitorInterest = require('../models').LiveFairVisitorInterest;
var LiveFairCompanyEvents = require('../models').LiveFairCompanyEvents;

var CompanyEventSchema = Joi.object().keys({
    location: Joi.string().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    speakers: Joi.string().required(),
    subject: Joi.string().required()
});

var LiveFairSchema = Joi.object().keys({
    organiserID: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    endTime: Joi.date().required(),
    local: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    map: Joi.string().required(),
    interestList: Joi.array().items(Joi.string()).required()
});

module.exports = function(server){
    server.route({
        method: 'GET',
        path: '/livefairs',
        config:{
            auth: {
                mode: 'optional',
                strategy: 'token'
            },
            handler: function (request, reply) {
                reply(LiveFair.findAll({order:'"liveFairID" DESC'}).then(function(liveFairs)
                {
                    return JSON.stringify(liveFairs);
                }).error(function(err){
                    return Boom.notFound('Live Fairs not found');
                }));
            }}
        });

    server.route({
        method: 'GET',
        path: '/livefairs/{id}',
        config:{
            auth: {
                mode: 'optional',
                strategy: 'token'
            },
            handler: function (request, reply) {
                var liveFairId=request.params.id;
                reply(LiveFair.find(liveFairId).then(function(liveFair)
                {
                    return JSON.stringify(liveFair);
                }).error(function(err){
                    return Boom.notFound('Live Fair not found');
                }));
            }}
        });

    server.route({
        method: 'GET',
        path: '/livefairs/{id}/map',
        config:{
            auth: {
                mode: 'optional',
                strategy: 'token'
            },
            handler: function (request, reply) {
                var LiveFairID = request.params.id;
                LiveFair.find({where:
                    {
                        liveFairID: LiveFairID
                    }}).then(function(livefair)
                    {
                        reply.file('./app/images/livefairmaps/'+livefair.map);
                    }).error(function(err){
                        return Boom.notFound('Live Fair map not found');
                    });
                }}
            });

    server.route({
        method: 'GET',
        path: '/livefairs/{id}/schedule',
        config:{
            auth: {
                mode: 'optional',
                strategy: 'token'
            },
            handler: function (request, reply) {
                var liveFairId=request.params.id;
                reply(LiveFairEvents.findAll({where:
                    {
                        liveFairEventsID: liveFairId
                    }}).then(function(liveFairEvents)
                    {
                        return JSON.stringify(liveFairEvents);
                    }).error(function(err){
                        return Boom.notFound('Live Fair schedule not found');
                    }));
            }}
        });

    server.route({
        method: 'GET',
        path: '/livefairs/{id}/companies',
        config:{
            auth: {
                mode: 'optional',
                strategy: 'token'
            },
            handler: function (request, reply) {
                var liveFairId=request.params.id;
                reply(
                    Stands.findAll({where: {liveFairLiveFairID: liveFairId}})
                    .map(function(company) {
                        return Company.find({where: {companyID: company.companyCompanyID,approved:true}});
                    }).then(function(companies) {
                        return JSON.stringify(companies);
                    }).error(function(err){
                        return Boom.notFound('Live Fair Stands not found');
                    })
                    );
            }}
        });

    server.route({
        method: 'GET',
        path: '/livefairs/{id}/visitors',
        config:{
            auth: {
                mode: 'optional',
                strategy: 'token'
            },
            handler: function (request, reply) {
                var liveFairId=request.params.id;
                reply(
                    VisitorLiveFair.findAll({where: {liveFairLiveFairID: liveFairId}})
                    .map(function(visitor) {
                        return Visitor.find({where: {visitorID: visitor.visitorVisitorID}});
                    }).then(function(visitors) {
                        return JSON.stringify(visitors);
                    }).error(function(err){
                        return Boom.notFound('Live Fair Visitors not found');
                    })
                    );
            }}
        });

    server.route({
     method: 'GET',
     path: '/livefairs/{LiveFairID}/companies/{CompanyID}',
     config:{
         auth: {
             mode: 'optional',
             strategy: 'token'
         },
         handler: function (request, reply) {
             var liveFairId=request.params.LiveFairID;
             var CompanyID = request.params.CompanyID;
             LiveFairCompanyInterest.findAll({
                 where:{liveFairIDref:liveFairId,companyIDref:CompanyID}
             }).map(function(liveFairInterest){
                 return Interest.find({
                     where:{
                         interestID:liveFairInterest.interestIDref
                     }
                 }).then(function(interest){
                     return interest;
                 });
             }).then(function(interests) {
                 reply(JSON.stringify(interests));
             }).error(function(err){
                 return Boom.notFound('Company interests not found');
             });
         }
     }
 });

server.route({
 method: 'GET',
 path: '/livefairs/{LiveFairID}/companies/{CompanyID}/edit',
 config:{
     auth: {
         mode: 'optional',
         strategy: 'token'
     },
     handler: function (request, reply) {
         var liveFairId=request.params.LiveFairID;
         var CompanyID = request.params.CompanyID;
         LiveFairCompanyInterest.destroy({
             where:{liveFairIDref:liveFairId,companyIDref:CompanyID},
             individualHooks:true
         }).then(function(liveFairInterest){
             return Interest.find({
                 where:{
                     interestID:liveFairInterest.interestIDref
                 }
             }).then(function(interest){
                 return interest;
             });
         }).then(function(interests) {
             reply(JSON.stringify(interests));
         }).error(function(err){
             return Boom.notFound('Company interests not found');
         });
     }
 }
});

server.route({
    method: 'POST',
    path: '/livefairs/{LiveFairID}/companies/{CompanyID}/counter',
    config:{
        auth: {
            mode: 'optional',
            strategy: 'token'
        },
        handler: function (request, reply) {
            var CompanyID = request.params.CompanyID;
            reply(Company.find({where:{
                companyID:CompanyID
            }}).then(function(company){
                Company.update({
                    'visitorCounter':company.visitorCounter+1
                },{where:{
                    companyID:CompanyID
                }}).then(function(numCompany){
                    Stands.find({
                        where:{companyCompanyID:CompanyID}
                    }).then(function(stand){
                        Stands.update({
                            'visitorCounter':stand.visitorCounter+1
                        },{where:{companyCompanyID:CompanyID}});
                    }).error(function(err){
                        return Boom.notFound('Counter not found');
                    });
                });
            }));
        }}
    });

server.route({
    method: 'GET',
    path: '/livefairs/search/date/{Date}',
    config:{
        auth: {
            mode: 'optional',
            strategy: 'token'
        },
        handler: function (request, reply) {
            var LiveFairDate=request.params.Date;
            reply(LiveFair.findAll(
            {
                where: ['"date"::date = ?',LiveFairDate]

            }).then(function(liveFair)
            {
                return JSON.stringify(liveFair);
            }).error(function(err){
             return Boom.notFound('Live Fairs on that date not found');
         }));
        }}
    });

server.route({
    method: 'GET',
    path: '/livefairs/search/location/{Location}',
    config:{
        auth: {
            mode: 'optional',
            strategy: 'token'
        },
        handler: function (request, reply) {
            var LiveFairLocation=request.params.Location;
            reply(LiveFair.findAll(
            {
                where: ['"location" LIKE ?','%'+LiveFairLocation+'%']

            }).then(function(liveFair)
            {
                return JSON.stringify(liveFair);
            }).error(function(err){
                return Boom.notFound('Live Fairs not found on that location');
            }));
        }}
    });

server.route({
    method: 'GET',
    path: '/livefairs/{id}/interests',
    config:{
        auth: {
            strategy: 'token'
        },
        handler: function (request, reply) {
            var liveFairId=request.params.id;
            reply(
                LiveFairInterest.findAll({where: {liveFairLiveFairID: liveFairId}})
                .map(function(interest) {
                    return Interest.find({where: {interestID: interest.interestInterestID}});
                })
                .then(function(interest) {
                    return JSON.stringify(interest);
                }).error(function(err){
                 return  Boom.notFound('Live Fair interests not found');
             })
                );
        }}
    });

server.route({
    method: 'GET',
    path: '/livefairs/{liveFairid}/companies/{UserID}/matches',
    config:{
        auth: {
            mode:'optional',
            strategy: 'token'
        },
        handler: function (request, reply) {
            var LiveFairID=request.params.liveFairid;
            var UserID=request.params.UserID; 
            
            Users.find({where:{
                email:request.auth.credentials.dataValues.email,
                userID:UserID
            }}).then(function (params) {
                reply( sequelize.query('SELECT DISTINCT ON (company."companyID") company."companyID",company."companyName",company."logoImage",company.address,company.website,"user".contact,"user".description FROM stands,company,"liveFairCompanyInterest","liveFairVisitorInterest","user" WHERE "liveFairCompanyInterest"."interestIDref"="liveFairVisitorInterest"."interestIDref" AND "liveFairCompanyInterest"."liveFairIDref"=? AND "liveFairVisitorInterest"."visitorIDref"=? AND company."companyID"="liveFairCompanyInterest"."companyIDref" AND "user"."userID"=company."companyID" AND stands."companyCompanyID"=company."companyID" AND stands.approved = "TRUE"',
                { replacements: [LiveFairID,UserID], type: sequelize.QueryTypes.SELECT }
                ).then(function(companies)
                {
                 return JSON.stringify(companies);
             }).error(function(err){
                 console.log(err);
                 return Boom.notFound('No Matches found');
             }));
            }).error(function(err){
               return Boom.unauthorized(err); 
            }); 
        }}
    });

server.route({
    method: 'GET',
    path: '/livefairs/{liveFairid}/companies/{companyID}/events',
    config:{
        auth: {
            mode:'optional',
            strategy: 'token'
        },
        handler: function (request, reply) {
            var LiveFairID=request.params.liveFairid;
            var CompanyID=request.params.companyID;

            LiveFairCompanyEvents.findAll({
                where:{
                    companyIDref:CompanyID,
                    liveFairIDref:LiveFairID
                }
            }
            ).map(function(companyEvents) {
                return CompanyEvents.find({
                    where: {
                        companyEventsID:companyEvents.companyEventsIDref
                    }
                }).then(function(event){
                    console.log(JSON.stringify(event));
                    return event;
                });
            }).then(function(events) {
                reply(JSON.stringify(events));
            }
            ).error(function(err){
                return Boom.notFound('Live Fair Stand Events not found');
            });
        }}
    });

server.route({
    method: 'GET',
    path: '/livefairs/{liveFairid}/companies/{companyID}/events/{EventID}',
    config:{
        auth: {
            mode:'optional',
            strategy: 'token'
        },
        handler: function (request, reply) {
            var CompanyEventID=request.params.EventID;

            reply(CompanyEvents.findAll({
                where:{
                    companyEventsID:CompanyEventID
                }
            }
            ).then(function(event){
                return JSON.stringify(event);
            }).error(function(err){
                return Boom.notFound('Live Fair Stand Event not found');
            }));
        }}
    });

server.route({
    method: 'POST',
    path: '/livefairs/{LiveFairID}/interests/{UserID}/submit',
    config:{
        auth: {
            strategy: 'token'
        },
        
        
        handler: function (request, reply) {
            if(!request.payload.interests){
                throw new Error('Missing critical fields');
            }

            var LiveFairID = request.params.LiveFairID;
            var UserID = request.params.UserID;

            Users.find({
                where:{
                    email:request.auth.credentials.dataValues.email,
                    userID:UserID
                }
            }).then(function(user) {
                if(!user) {
                    throw new Error('User not found');
                }
            
                var userType = user.type;
                if(userType == "visitor") {

                   VisitorLiveFair.create({
                        'liveFairLiveFairID': LiveFairID,
                        'visitorVisitorID': UserID
                    }).then(function(){
                        var interests=request.payload.interests;
                        for(var i = 0; i<interests.length; i++){
                            LiveFairVisitorInterest.create({
                                'liveFairIDref':LiveFairID,
                                'interestIDref':interests[i],
                                'visitorIDref':UserID
                            });
                        }
                        reply("Successful fair join");

                    }).catch(function(error) {
                        console.log(JSON.stringify(error));
                        return reply(Boom.badRequest(error.message));
                    });
                }
                else if(userType == 'company') {
                    Stands.create({
                        'liveFairLiveFairID': LiveFairID,
                        'companyCompanyID': UserID,
                        'visitorCounter': 0,
                        'approved': true
                    }).then(function(){
                        var interests=request.payload.interests;
                        for(var i = 0; i<interests.length; i++){
                            LiveFairCompanyInterest.create({
                                'liveFairIDref':LiveFairID,
                                'interestIDref':interests[i],
                                'companyIDref':UserID
                            });
                        }
                        reply("Successful fair join");

                    }).catch(function(error) {
                        console.log(JSON.stringify(error));
                        return reply(Boom.badRequest(error.message));
                    });
                }
                else {
                    throw new Error('Wrong user type');
                }
            }).error(function (err) {
                return Boom.unauthorized(err);
            });
        }}
    });

    server.route({
    method: 'POST',
    path: '/livefairs/{LiveFairID}/interests/{UserID}/cancel',
    config:{
        auth: {mode: 'optional',
            strategy: 'token'
        },
        
        handler: function (request, reply) {

            var LiveFairID = request.params.LiveFairID;
            var UserID = request.params.UserID;

             Users.find({
                where:{
                    email:request.auth.credentials.dataValues.email,
                    userID:UserID
                }
            }).then(function(user) {
                if(!user) {
                    throw new Error('User not found');
                }
            
                var userType = user.type;
                if(userType == "visitor") {

                   console.log('estou aqui');
                    VisitorLiveFair.destroy({where:{
                       'liveFairLiveFairID': LiveFairID,
                        'visitorVisitorID': UserID
                   }}).then(function(){
                        console.log('estou aqui');
                         LiveFairVisitorInterest.destroy({
                            where:{
                                'liveFairIDref':LiveFairID,
                                'visitorIDref':UserID
                            },individualHooks:true
                        });
                        reply("Successful fair cancelation");

                    }).catch(function(error) {
                        console.log(JSON.stringify(error));
                        return reply(Boom.badRequest(error.message));
                    });
                }
                else if(userType == 'company') {
                    Stands.destroy({where:{
                       'liveFairLiveFairID': LiveFairID,
                        'companyCompanyID': UserID 
                    }}).then(function(){
                            LiveFairCompanyInterest.destroy({where:{
                                'liveFairIDref':LiveFairID,
                                'companyIDref':UserID
                            },individualHooks:true});
                        reply("Successful fair cancelation");

                    }).catch(function(error) {
                        console.log(JSON.stringify(error));
                        return reply(Boom.badRequest(error.message));
                    });
                }
                else {
                    throw new Error('Wrong user type');
                }
            }).error(function (err) {
                return Boom.unauthorized(err);
            });
        }}
    });

server.route({
    method: 'GET',
    path: '/livefairs/search/date/{DateStart}/{DateEnd}',
    config:{
        auth: {
            mode: 'optional',
            strategy: 'token'
        },
        handler: function (request, reply) {
            var LiveFairDateStart=request.params.DateStart;
            var LiveFairDateEnd=request.params.DateEnd;

            reply(LiveFair.findAll(
            {
                where: ['"date"::date >= ? AND "date"::date <= ?', LiveFairDateStart, LiveFairDateEnd]

            }).then(function(liveFair)
            {
                return JSON.stringify(liveFair);
            }).error(function(err){
                return Boom.notFound('Live Fair between dates not found');
            }));
        }}
    });


server.route({
    method: 'GET',
    path: '/livefairs/search/date/{DateStart}&{DateEnd}',
    config:{
        auth: {
            mode: 'optional',
            strategy: 'token'
        },
        handler: function (request, reply) {
            var LiveFairDateStart=request.params.DateStart;
            var LiveFairDateEnd=request.params.DateEnd;

            reply(LiveFair.findAll(
            {
                where: ['"date"::date >= ? AND "date"::date <= ?', LiveFairDateStart, LiveFairDateEnd]

            }).then(function(liveFair)
            {
                return JSON.stringify(liveFair);
            }).error(function(err){
             return Boom.notFound('Live Fair between dates not found');
         }));
        }}
    });

server.route({
 method: 'GET',
 path: '/livefairs/{livefairID}/{userID}/standParticipating',
 config:{
     auth: {
         mode: 'optional',
         strategy: 'token'
     },
     handler: function (request, reply) {
         var liveFairID=request.params.livefairID;
         var userID=request.params.userID;

         Stands.findAll({
             where: {
                 liveFairLiveFairID: liveFairID,
                 companyCompanyID:userID
             }
         }).then(function(liveFairs) {
             if(liveFairs.length > 0)
                 reply(JSON.stringify(true));
             else
                 reply(JSON.stringify(false));
         }).error(function(error) {
             reply(JSON.stringify(false));
         });
     }}
 });

server.route({
 method: 'GET',
 path: '/livefairs/{livefairID}/{userID}/participating',
 config:{
     auth: {
         mode: 'optional',
         strategy: 'token'
     },
     handler: function (request, reply) {
         var liveFairID=request.params.livefairID;
         var userID=request.params.userID;
         VisitorLiveFair.findAll({
             where: {
                 liveFairLiveFairID: liveFairID,
                 visitorVisitorID:userID
             }
         }).then(function(liveFairs){
             if(liveFairs.length > 0)
                 reply(JSON.stringify(true));
             else
                 reply(JSON.stringify(false));
         }).error(function(error) {
             reply(JSON.stringify(false));
         });
     }}
 });

server.route({
    method: 'POST',
    path: '/livefairs/{livefairID}/companies/{companyID}/addStandEvent',
    config:{
        auth: {
            mode: 'optional',
            strategy: 'token'
        },
        handler: function(request, reply) {
            return sequelize.transaction(function(t) {

                var liveFairID=request.params.livefairID;
                var companyID=request.params.companyID;
                
                Users.find({
                    where:{
                        email:request.auth.credentials.dataValues.email,
                        userID:companyID,
                        type:request.auth.credentials.dataValues.email,
                        type:'company'
                }}).then(function name(params) {
                    var Schematest={
                    location: request.payload.location,
                    startTime: request.payload.startTime,
                    endTime: request.payload.endTime,
                    speakers: request.payload.speakers,
                    subject: request.payload.subject
                };

                var validate = Joi.validate(Schematest,CompanyEventSchema);


                if(validate.error!==null){
                    throw new Error(validate.error.message);
                }
                else{

                    var ID = uuid.v4();
                    console.log(ID+"\n");
                    return CompanyEvents.create({
                        'companyEventsID':ID,
                        'location':Schematest.location,
                        'startTime':Schematest.startTime,
                        'endTime':Schematest.endTime,
                        'speakers':Schematest.speakers,
                        'subject':Schematest.subject
                    }, {transaction: t})
                    .then(function(user) {
                      return LiveFairCompanyEvents.create({
                         'liveFairIDref':liveFairID,
                         'companyIDref':companyID,
                         'companyEventsIDref':ID
                     }, {transaction: t});
                  });
                }})
                .then(function(result) {
                    reply(JSON.stringify('Evento criado com sucesso'));
                });
                }).error(function(err) {
                  reply(Boom.unauthorized(err));  
                }).catch(function(error) {
                    reply(Boom.badRequest(error));
                });
            }}
        });

server.route({
    method: 'POST',
    path: '/livefairs/{livefairID}/companies/{companyID}/events/{eventID}/edit',
    config:{
        auth: {
            mode: 'optional',
            strategy: 'token'
        },
        handler: function(request, reply) {

            var companyID=request.params.companyID;
            var eventID=request.params.eventID;

            Users.find({
                    where:{
                        email:request.auth.credentials.dataValues.email,
                        userID:companyID,
                        type:request.auth.credentials.dataValues.email,
                        type:'company'
            }}).then(function (user) {
                            var Schematest={
                location: request.payload.location,
                startTime: request.payload.startTime,
                endTime: request.payload.endTime,
                speakers: request.payload.speakers,
                subject: request.payload.subject
            };

            var validate = Joi.validate(Schematest,CompanyEventSchema);
            if(validate.error!==null){
                throw new Error(validate.error.message);
            }
            else{
                CompanyEvents.update({
                    'location':Schematest.location,
                    'startTime':Schematest.startTime,
                    'endTime':Schematest.endTime,
                    'speakers':Schematest.speakers,
                    'subject':Schematest.subject
                },{
                    where:{
                        'companyEventsID':eventID
                    }
                })
                .then(function(user) {
                   reply(JSON.stringify('Edição evento bem sucedida'));
               });
            }}).error(function (err) {
                Boom.auauthorized(err);
            }).catch(function(error) {
                reply(Boom.badRequest(error));
            });
           }}
       });

server.route({
    method: 'POST',
    path: '/livefairs/{livefairID}/companies/{companyID}/events/{eventID}/delete',
    config:{
        auth: {
            mode: 'optional',
            strategy: 'token'
        },
        handler: function(request, reply) {

            return sequelize.transaction(function(t) {

                var companyID=request.params.companyID;
                var eventID=request.params.eventID;

                Users.find({
                    where:{
                        email:request.auth.credentials.dataValues.email,
                        userID:companyID,
                        type:request.auth.credentials.dataValues.email,
                        type:'company'
                }}).then(function (user) {
                                    var ID = uuid.v4();
                console.log(ID+"\n");
                return CompanyEvents.destroy({where:{
                    'companyEventsID':eventID
                }}, {transaction: t})
                .then(function(event) {
                  return LiveFairCompanyEvents.destroy({where:{
                    'companyEventsIDref':eventID
                }}, {transaction: t}).then(function(events){
                   reply(JSON.stringify('Evento apagado com sucesso'));
               });
               });


            }).error(function (err) {
                Boom.aunothorized(err);
            });
            });
        }}
    });

server.route({
    method: 'POST',
    path: '/livefairs/new/',
    config:{
        auth: {
           mode: 'optional',
           strategy: 'token'
       },
       handler: function (request, reply) {
           
       var Schematest={
           organiserID: request.payload.organiserID,
           name: request.payload.name,
           description: request.payload.description,
           startDate: request.payload.startDate,
           endDate: request.payload.endDate,
           local: request.payload.local,
           address: request.payload.address,
           city: request.payload.city,
           map: request.payload.map,
           interestList: request.payload.interestList
        };
        
        var validate = Joi.validate(Schematest,LiveFairSchema);


        if(validate.error!==null){
            throw new Error(validate.error.message);
        }
        else{
        var fairOrgID = request.payload.organiserID;
        var fairName = request.payload.name;
        var fairDesc = request.payload.description;
        var fairDSstr = request.payload.startDate;
        var fairDS = new Date(fairDSstr);
        var fairDEstr = request.payload.endDate;
        var fairDE = new Date(fairDEstr);
        var fairLoc = request.payload.local;
        var fairAdd = request.payload.address;
        var fairCit = request.payload.city;
        var fairMap = request.payload.map;
        var ID=uuid.v4();
        var fairInterest = request.payload.interestList;

        LiveFair.create({
         'liveFairID':ID,
         'organizerOrganizerID':fairOrgID,
         'name':fairName,
         'description':fairDesc,
         'startDate':fairDS,
         'endDate':fairDE,
         'local':fairLoc,
         'address':fairAdd,
         'city':fairCit,
         'map':fairMap
     })
        .then(function(result) {
            for(var i = 0; i<fairInterest.length; i++){
                var intID=uuid.v4();
                Interest.create({
                    'liveFairLiveFairID':ID,
                    'interestID':intID,
                    'interest':fairInterest[i]
                });
                LiveFairInterest.create({
                    'liveFairLiveFairID':ID,
                    'interestInterestID':intID
                });
            }
            reply(JSON.stringify('Live Fair criada com sucesso'));
        })
        .catch(function(error) {
            reply(Boom.badRequest(error.message));
            console.log(error.message);
        });

    }}}});


};
