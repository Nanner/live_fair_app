var module = angular.module('starter');

module.factory('liveFairApi', function($resource, server) {
    var LiveFair = $resource(server.url + '/livefairs/:liveFairID', {liveFairID:'@liveFairID'});

    var LiveFairInterests = $resource(server.url + '/livefairs/:liveFairID/interests', {liveFairID:'@liveFairID'});

    var Stands = $resource(server.url + '/livefairs/:liveFairID/companies', {liveFairID: '@liveFairID'});

    var Schedule = $resource(server.url + '/livefairs/:liveFairID/schedule', {liveFairID: '@liveFairID'});

    var Register = $resource(server.url + '/register', {email: '@email', password: '@password', type: '@type', address: '@address', compayName: '@companyName', website: '@website'});

    var api = {

        getLiveFairs: function() {
            return LiveFair.query();
        },
        getLiveFair: function(fairID) {
            return LiveFair.get({liveFairID: fairID});
        },
        getLiveFairInterests: function(fairID) {
            return LiveFairInterests.query({liveFairID: fairID});
        },
        getLiveFairStands: function(fairID) {
            return Stands.query({liveFairID: fairID});
        },
        getLiveFairSchedule: function(fairID) {
            return Schedule.query({liveFairID: fairID});
        },
        postRegister: function(emailToSend, passwordToSend, typeToSend, addressToSend, companyNameToSend, websiteToSend) {
            return Register.save({email: emailToSend, password: passwordToSend, type: typeToSend, address: addressToSend, companyName: companyNameToSend, website: websiteToSend});
        }
    };

    return api;
});
