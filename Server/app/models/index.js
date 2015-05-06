"use strict";

var FORCE_SEQUELIZE_SYNC = true;

var Sequelize = require('sequelize');

// initialize database connection
var sequelize = new Sequelize('liveFairAppDB', 'postgres', 'root', {
        host: 'localhost',
        dialect: 'postgres',

        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    }
);

// load models
var models = [
    'User',
    'Organizer',
    'Company',
    'Visitor',
    'LiveFair',
    'LiveFairEvents',
    'Interest',
    'CompanyEvents',
    'Stands',
    'Connection',
    'LiveFairVisitorInterest',
    'LiveFairCompanyEvents',
    'LiveFairCompanyInterest',
    'LiveFairInterest'
];
models.forEach(function(model) {
    module.exports[model] = sequelize.import(__dirname + '/' + model);
});

// describe relationships
(function(m) {
    m.Organizer.belongsTo(m.User, {foreignKey: 'organizerID'});

    m.Company.belongsTo(m.User, {foreignKey: 'companyID'});

    m.Visitor.belongsTo(m.User, {foreignKey: 'visitorID'});

    m.Visitor.belongsToMany(m.LiveFair, {through: "visitor_liveFair"});
    m.LiveFair.belongsToMany(m.Visitor, {through: "visitor_liveFair"});
    m.Organizer.hasMany(m.LiveFair);

    m.LiveFair.hasMany(m.LiveFairEvents, {foreignKey: 'liveFairEventsID'});

    m.Company.belongsToMany(m.LiveFair, {through: "stands"});
    m.LiveFair.belongsToMany(m.Company , {through: "stands"});
    
    //liked table
    m.Company.belongsToMany(m.Visitor, {through: "connection"});
    m.Visitor.belongsToMany(m.Company, {through: "connection"});

    //connection between LiveFair and Interest
    m.Interest.belongsTo(m.LiveFair, {through: "liveFairInterest"});
    m.LiveFair.belongsToMany(m.Interest, {through: "liveFairInterest"});
})(module.exports);

sequelize.sync({force: FORCE_SEQUELIZE_SYNC});

// export connection
module.exports.sequelize = sequelize;
module.exports.Sequelize = Sequelize;