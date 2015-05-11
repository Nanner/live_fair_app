var Promise = require("bluebird");

var visitorLiveFair = require('../models').visitorLiveFair;

server.route({
	method: 'POST',
	path: '/visitor/{id}/joinLiveFair/{liveFairID}',
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