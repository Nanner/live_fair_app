var Promise = require("bluebird");
var Boom = require('boom');

var visitorLiveFair = require('../models').VisitorLiveFair;

module.exports = function(server){
	server.route({
		method: 'POST',
		path: '/visitor/joinLiveFair',
		config:{
            auth: {
               strategy: 'token'
           },
		handler: function (request, reply) {			
			if(!request.payload.userid || !request.payload.livefairid)
			{
                    reply(Boom.badRequest("Invalid Parameters"));
			}
			else
			{
				var visitorID=request.payload.userid;
				var liveFairID=request.payload.livefairid;
				reply(
					visitorLiveFair.create({
							'liveFairLiveFairID': liveFairID,
							'visitorVisitorID': visitorID
						})
						.then(function(result) {
							return JSON.stringify('Adesão à LiveFair concluída com sucesso!');
						})
					);
			}
		}}
	});
};