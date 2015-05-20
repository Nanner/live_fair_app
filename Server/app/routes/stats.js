var Promise = require("bluebird");
var Boom = require('boom');

var sequelize = require('../models').sequelize;

var User = require('../models').User;
var Company = require('../models').Company;
var Visitor = require('../models').Visitor;
var Organizer = require('../models').Organizer;
var Stands = require('../models').Stands;

module.exports = function(server){
	 server.route({
        method: 'GET',
        path: '/livefairs/{livefairid}/companies/{companyid}/stats/visitors',
        config:{
            auth: {
               mode:'optional',
               strategy: 'token'
           },
            handler: function (request, reply) {
                var LiveFairID = request.params.livefairid;
                var CompanyID = request.params.companyid;
                  Company.find({
                      where:{companyID:CompanyID}
                  }).then(function(company){
                      Stands.find({
                          where:{companyCompanyID:CompanyID,liveFairLiveFairID:LiveFairID}
                      }).then(function(stand){
                          console.log(JSON.stringify([company.visitorCounter,stand.visitorCounter]));
                          reply(JSON.stringify([company.visitorCounter,stand.visitorCounter]));
                      });
             });  
        }}
    });
    
	 server.route({
        method: 'GET',
        path: '/livefairs/{livefairid}/companies/{companyid}/stats/hits',
        config:{
            auth: {
               mode:'optional',
               strategy: 'token'
           },
            handler: function (request, reply) {
                var LiveFairID = request.params.livefairid;
                var CompanyID = request.params.companyid;
                  Company.find({
                      where:{companyID:CompanyID}
                  }).then(function(company){
                      Stands.find({
                          where:{companyCompanyID:CompanyID,liveFairLiveFairID:LiveFairID}
                      }).then(function(stand){
                          console.log(JSON.stringify([company.visitorCounter,stand.visitorCounter]));
                          reply(JSON.stringify([company.visitorCounter,stand.visitorCounter]));
                      });
             });  
        }}
    });    
};