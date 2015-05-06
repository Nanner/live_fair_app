var LiveFair = require('../models').LiveFair;
var LiveFairEvents = require('../models').LiveFairEvents;
var Stands = require('../models').Stands;
var Company = require('../models').Company;
var Interest = require('../models').Interest;
var LiveFairInterest = require('../models').LiveFairInterest;

module.exports = function(server){
    server.route({
        method: 'GET',
        path: '/livefairs',
        handler: function (request, reply) {
            reply(LiveFair.findAll({order:'"liveFairID" DESC'}).then(function(liveFairs)
            {
                return JSON.stringify(liveFairs);
            }));
        }
    });

    server.route({
        method: 'GET',
        path: '/livefairs/{id}',
        handler: function (request, reply) {
            var liveFairId=request.params.id;
            reply(LiveFair.find(liveFairId).then(function(liveFair)
            {
                return JSON.stringify(liveFair);
            }));
        }
    });

    server.route({
        method: 'GET',
        path: '/livefairs/{id}/schedule',
        handler: function (request, reply) {
            var liveFairId=request.params.id;
            reply(LiveFairEvents.findAll({where:
                { 
                    liveFairEventsID: liveFairId
                }}).then(function(liveFairEvents)
            {
                return JSON.stringify(liveFairEvents);
            }));
        }
    });
    
    server.route({
        method: 'GET',
        path: '/livefairs/{id}/companies',
        handler: function (request, reply) {
            var liveFairId=request.params.id;
            reply(Stands.findAll({where:
                { 
                    liveFairLiveFairID: liveFairId
                }}).then(function(liveFairCompanies)
            {
                var answer = [];
                
                liveFairCompanies.forEach(function(element) {
                    
                    Company.find({where:
                    {
                        companyID: element.dataValues.companyCompanyID
                    }}).then(function(company){
                        answer.push(company);
                    });
                   
                }, this);
                
                return JSON.stringify(answer);
            }));
        }
    });
    
    server.route({
        method: 'GET',
        path: '/livefairs/search/date/{Date}',
        handler: function (request, reply) {
            var LiveFairDate=request.params.Date;
            reply(LiveFair.findAll(
                { 
                   where: ['"date"::date = ?',LiveFairDate] 
                   
                }).then(function(liveFair)
            {
                return JSON.stringify(liveFair);
            }));
        }
    });
    
    server.route({
        method: 'GET',
        path: '/livefairs/search/location/{Location}',
        handler: function (request, reply) {
            var LiveFairLocation=request.params.Location;
            reply(LiveFair.findAll(
                { 
                   where: ['"location" LIKE ?','%'+LiveFairLocation+'%'] 
                   
                }).then(function(liveFair)
            {
                return JSON.stringify(liveFair);
            }));
        }
    });
    
    server.route({
        method: 'GET',
        path: '/livefairs/{id}/interests',
        handler: function (request, reply) {
            var LiveFairID=request.params.id;
            reply(LiveFair.findAll(
                { 
                   where: ['"location" LIKE ?','%'+LiveFairID+'%'] 
                   
                }).then(function(liveFair)
            {
                return JSON.stringify(liveFair);
            }));
        }
    });
};