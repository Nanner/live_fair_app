var Promise = require("bluebird");
var Boom = require("boom");

var LiveFair = require('../models').LiveFair;
var LiveFairEvents = require('../models').LiveFairEvents;
var Stands = require('../models').Stands;
var Users = require('../models').User;
var Company = require('../models').Company;
var Interest = require('../models').Interest;
var LiveFairInterest = require('../models').LiveFairInterest;
var LiveFairCompanyInterest = require('../models').LiveFairCompanyInterest;
var LiveFairVisitorInterest = require('../models').LiveFairVisitorInterest;

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
            var LiveFairID = request.params.UserID;
            LiveFair.find({where:
                {
                    map: LiveFairID
                }}).then(function(livefair)
            {
                reply.file('./images/maps/'+livefair.map);
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
                        return Company.find({where: {companyID: company.companyCompanyID}});
                    })
                    .then(function(companies) {
                        return JSON.stringify(companies);
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
            reply(
                LiveFairCompanyInterest.findAll({
                where:{liveFairIDref:liveFairId,companyIDref:CompanyID}}).map(function(interest){
                     return Interest.find({
                     where:{
                        interestID:interest.interestIDref
                     }
                 }).then(function(interests){
                    return JSON.stringify(interests);
                  });
                }));
        }}
    });
    
    server.route({
        method: 'GET',
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
                    })
            );
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
           }));
       }}
   });
   
   server.route({
        method: 'POST',
        path: '/livefairs/{LiveFairID}/interests/{UserID}/submit/',
         config:{
            auth: {
               strategy: 'token'
           },
            handler: function (request, reply) {
                var LiveFairID = request.params.LiveFairID;
                var UserID = request.params.UserID;
                var interests=JSON.parse(request.payload.interests);
                for(var i=1;i<=interests.length;i+=2){
                    LiveFairVisitorInterest.create({
                        'liveFairIDref':LiveFairID,
                        'interestIDref':interests[i],
                        'visitorIDref':UserID
                    });
                }
                reply("Interesses selecionados corretamente");
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
			}));
		}}
	});
};