var module = angular.module('starter');

module.factory('liveFairApi', function($resource, server) {
    var LiveFair = $resource(server.url + '/livefairs/:liveFairID', {liveFairID:'@liveFairID'});

    var Stands = $resource(server.url + '/livefairs/:liveFairID/companies', {liveFairID: '@liveFairID'});

    var api = {

        getLiveFairs: function() {
            return LiveFair.query();
        },

        getLiveFair: function(fairID) {
            return LiveFair.get({liveFairID: fairID});
        },

        getLiveFairStands: function(fairID) {
            return Stands.query({liveFairID: fairID});
        }
    }

    return api;
});
