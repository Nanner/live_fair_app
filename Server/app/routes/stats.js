var Promise = require("bluebird");
var Boom = require('boom');

var sequelize = require('../models').sequelize;

var User = require('../models').User;
var Company = require('../models').Company;
var Visitor = require('../models').Visitor;
var Organizer = require('../models').Organizer;
var Stands = require('../models').Stands;
var LiveFairVisitorInterest = require('../models').LiveFairVisitorInterest;
var Connection = require('../models').Connection;
var VisitorLiveFair = require('../models').VisitorLiveFair;

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
                      }).error(function(err){
                          return Boom.notFound('Stats not found');
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
                
                  sequelize.query('SELECT count(distinct("liveFairVisitorInterest"."visitorIDref"))FROM interest,"liveFairCompanyInterest","liveFairVisitorInterest"WHERE"liveFairCompanyInterest"."liveFairIDref" IS NOT NULL AND "liveFairCompanyInterest"."companyIDref" IS NOT NULL AND "liveFairCompanyInterest"."interestIDref" IS NOT NULL AND "liveFairVisitorInterest"."liveFairIDref" IS NOT NULL AND "liveFairVisitorInterest"."visitorIDref" IS NOT NULL AND "liveFairVisitorInterest"."interestIDref" IS NOT NULL AND "liveFairCompanyInterest"."liveFairIDref" = ? AND "liveFairVisitorInterest"."liveFairIDref" = ? AND "liveFairCompanyInterest"."companyIDref" = ?AND "liveFairVisitorInterest"."interestIDref" = "liveFairCompanyInterest"."interestIDref" AND interest."interestID" = "liveFairVisitorInterest"."interestIDref" AND interest."interestID" = "liveFairCompanyInterest"."interestIDref"  GROUP BY "liveFairVisitorInterest"."visitorIDref"',
                        { replacements: [LiveFairID,LiveFairID,CompanyID], type: sequelize.QueryTypes.SELECT }).then(function (interestCount) {
                            sequelize.query('SELECT interest.interest, count(distinct("liveFairVisitorInterest"."visitorIDref"))FROM interest,"liveFairCompanyInterest","liveFairVisitorInterest"WHERE"liveFairCompanyInterest"."liveFairIDref" IS NOT NULL AND "liveFairCompanyInterest"."companyIDref" IS NOT NULL AND "liveFairCompanyInterest"."interestIDref" IS NOT NULL AND "liveFairVisitorInterest"."liveFairIDref" IS NOT NULL AND "liveFairVisitorInterest"."visitorIDref" IS NOT NULL AND "liveFairVisitorInterest"."interestIDref" IS NOT NULL AND "liveFairCompanyInterest"."liveFairIDref" = ? AND "liveFairVisitorInterest"."liveFairIDref" = ? AND "liveFairCompanyInterest"."companyIDref" = ? AND "liveFairVisitorInterest"."interestIDref" = "liveFairCompanyInterest"."interestIDref" AND interest."interestID" = "liveFairVisitorInterest"."interestIDref" AND interest."interestID" = "liveFairCompanyInterest"."interestIDref" GROUP BY interest."interestID"',
                        { replacements: [LiveFairID,LiveFairID,CompanyID], type: sequelize.QueryTypes.SELECT }
                        ).then(function(interestCountTotal) {
                            VisitorLiveFair.count({
                                where:{
                                   liveFairLiveFairID: LiveFairID
                                }
                            }).then(function(visitorCount){
                                var visitorInterestCounter=0;
                                for(var i=0;i<interestCount.length;i++){
                                    visitorInterestCounter+=parseInt(interestCount[i].count);
                                }
                                var percentil;
                                console.log(visitorCount);
                                if(visitorCount===0)
                                    percentil=0;
                                else
                                    percentil = Math.round((visitorInterestCounter/visitorCount) * 1000)/10;
                                reply([interestCountTotal,{totalHits:visitorInterestCounter},{percentage:percentil}]);
                            }); 
                });
                        })
                  .error(function(err){
                   return Boom.notFound('Stats not found');
                }); 
        }}
    });
    
    server.route({
        method: 'GET',
        path: '/livefairs/{livefairid}/companies/{companyID}/stats/likes',
         config:{
            auth: {
               mode: 'optional',
               strategy: 'token'
           },
            handler: function (request, reply) {
                var CompanyID = request.params.companyID;
                reply (Connection.count(
                    {where:{
                   companyCompanyID:CompanyID,
                   liked:'true'
                },
                group:'"connection"."companyCompanyID"'
                }).then(function(LikeCount){
                    if(LikeCount.length===0)
                    return [{"count":"0"}];
                    else
                    return LikeCount;
                }).error(function(err){
                    return Boom.notFound(' Stats not found');
                })
                );
           }}
    });
    
        server.route({
        method: 'GET',
        path: '/livefairs/{livefairid}/companies/{companyID}/stats/contactShares',
         config:{
            auth: {
               mode: 'optional',
               strategy: 'token'
           },
            handler: function (request, reply) {
                var CompanyID = request.params.companyID;
                reply (Connection.count(
                    {where:{
                   companyCompanyID:CompanyID,
                   sharedContact:'true'
                },
                group:'"connection"."companyCompanyID"'
                }).then(function(shareCount){
                    if(shareCount.length===0)
                    return [{"count":"0"}];
                    else
                    return shareCount;
                }).error(function(err){
                    return Boom.notFound(' Stats not found');
                })
                );
           }}
    });        
};