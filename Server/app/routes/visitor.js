var Promise = require("bluebird");

var visitorLiveFair = require('../models').visitorLiveFair;

server.route({
	method: 'GET',
	path: '/visitor/joinLiveFair/{id}/{liveFairID}',
	handler: function (request, reply) {
		var visitorID=request.params.id;
		var liveFairID=request.params.liveFairID;
		reply(
			var visitorLiveFair.upsert({
					liveFairLiveFairID: liveFairId;
					visitorVisitorID: visitorID;
				})
				.then(function(visitorLiveFair) {
					return JSON.stringify(visitorLiveFair);
				})
			);
		}
	});