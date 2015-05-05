var Hapi = require('hapi');
var Good = require('good');
/*var Sequelize = require('sequelize');

var sequelize = new Sequelize('liveFairAppDB', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});*/

var server = new Hapi.Server({
    connections: {
        routes: {
            cors: true
        }
    }
});
    
server.connection({ port: 3000 });

server.app.models = require('./models');

require('./routes/liveFair')(server);

server.register({
    register: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*',
                log: '*'
            }
        }]
    }
}, function (err) {
    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.start(function () {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});

/*
Organizer.belongsTo(User, {foreignKey: 'organizerID'});

Company.belongsTo(User, {foreignKey: 'companyID'});

Visitor.belongsTo(User, {foreignKey: 'visitorID'});

Visitor.belongsToMany(LiveFair, {through: "visitor_liveFair"});
LiveFair.belongsToMany(Visitor, {through: "visitor_liveFair"});
Organizer.hasMany(LiveFair);

LiveFair.hasMany(LiveFairEvents, {foreignKey: 'liveFairEventsID'});

Company.belongsToMany(LiveFair, {through: "stands"});
LiveFair.belongsToMany(Company , {through: "stands"});

//liked table
Company.belongsToMany(Visitor, {through: "connection"});
Visitor.belongsToMany(Company, {through: "connection"});

//connection between LiveFair and Interest
Interest.belongsTo(LiveFair, {through: "liveFairInterest"});
LiveFair.belongsToMany(Interest, {through: "liveFairInterest"});

sequelize.sync({force: true});*/
