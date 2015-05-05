var module = angular.module('starter');

module.factory('liveFairApi', function($resource, server) {
    var LiveFair = $resource(server.url + '/lifefairs/:liveFairID',
        {liveFairID:'@liveFairID'});

    var api = {
        getLiveFairs: function() {
            return LiveFair.query();
        }
    }

    return api;
});
