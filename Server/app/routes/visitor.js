var Promise = require("bluebird");

var visitorLiveFair = require('../models').visitorLiveFair;

module.exports = function(server){
	server.route({
		method: 'GET',
		path: '/visitor/joinLiveFair/{id}/{liveFairID}',
		handler: function (request, reply) {
			var visitorID=request.params.id;
			var liveFairID=request.params.liveFairID;
			reply(
				visitorLiveFair.upsert({
						liveFairLiveFairID: liveFairId;
						visitorVisitorID: visitorID;
					})
					.then(function(result) {
						return JSON.stringify(result);
					})
				);
			}
		});
};