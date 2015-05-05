var LiveFair = require('../models').LiveFair;

module.exports = function(server){
    server.route({
        method: 'GET',
        path: '/lifefairs',
        handler: function (request, reply) {
            reply(LiveFair.findAll({order:'liveFairID DESC'}).then(function(liveFairs)
            {
                return JSON.stringify(liveFairs);
            }));
        }
    });

    server.route({
        method: 'GET',
        path: '/lifefairs/{id}',
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
        path: '/lifefairs/{id}/schedule',
        handler: function (request, reply) {
            var liveFairId=request.params.id;
            reply(LiveFairEvents.find({where:
            { liveFairEventsID: liveFairId
            }}).then(function(liveFairEvents)
            {
                return JSON.stringify(liveFairEvents);
            }));
        }
    });
};