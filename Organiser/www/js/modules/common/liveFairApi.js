var module = angular.module('starter');

module.factory('liveFairApi', function(server,$resource){
    var LiveFairs = $resource(server.url + '/livefairs');

    var api = {
    getLiveFairs: function() {
            return LiveFairs.query();
        }
    }
    console.log("aqui");
    return api;
});