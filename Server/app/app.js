var Hapi = require('hapi');
var Good = require('good');
var Sequelize = require('sequelize');

var sequelize = new Sequelize('PostgreSQL 9.4', 'admin', 'coisas', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.route({
    method: 'GET',
    path: '/lifefairs',
    handler: function (request, reply) {
      reply(LiveFair.findAll({order: 'liveFairID DESC'}).then(function(liveFairs)
      {
        JSON.stringify(liveFairs);
      }));
    }
});

server.route({
    method: 'GET',
    path: '/lifefairs/{id}',
    handler: function (request, reply) {
      reply(LiveFair.find({request.params.id}).then(function(liveFair)
      {
        JSON.stringify(liveFair);
      }));
    }
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});

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

var User = sequelize.define('user', {
  userID:{
    type: Sequelize.UUID,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING, unique: true
  },
  password: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.STRING
  },
  contact: {
    type: Sequelize.STRING, unique: true
  },
  address: {
    type: Sequelize.TEXT, unique: true
  },
  description: {
    type: Sequelize.TEXT
  },
  blocked: {
    type: Sequelize.BOOLEAN
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

var Organizer = sequelize.define('organizer', {
  organizerName: {
  type: Sequelize.STRING, unique: true
}
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

Organizer.belongsTo(User, {foreignKey: 'organizerID'});

var Company = sequelize.define('company', {
  companyName: {
    type: Sequelize.STRING, unique: true
  },
  logoImage: {
    type: Sequelize.STRING, unique: true
  },
  website: {
    type: Sequelize.STRING, unique: true
  },
  visitorCounter: {
    type: Sequelize.INTEGER
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

Company.belongsTo(User, {foreignKey: 'companyID'});

var Visitor = sequelize.define('visitor', {
  Photo: {
    type: Sequelize.STRING, unique: true
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

Visitor.belongsTo(User, {foreignKey: 'visitorID'});

var LiveFair = sequelize.define('liveFair', {
  liveFairID:{
    type: Sequelize.UUID,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING, unique: true
  },
  description: {
    type: Sequelize.STRING
  },
  date: {
    type: Sequelize.DATE
  },
  liveFairLocation: {
    type: Sequelize.STRING
  },
  map: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

Visitor.belongsToMany(LiveFair, {through: "visitor_liveFair"});
LiveFair.belongsToMany(Visitor, {through: "visitor_liveFair"});
Organizer.hasMany(LiveFair);

var LiveFairEvents = sequelize.define('liveFairEvents', {
  eventLocation: {
    type: Sequelize.STRING
  },
  time: {
    type: Sequelize.DATE
  },
  Speakers: {
    type: Sequelize.TEXT
  },
  Subject: {
    type: Sequelize.TEXT
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

LiveFair.hasMany(LiveFairEvents, {foreignKey: 'liveFairEventsID'});

var Interest = sequelize.define('interest', {
  interestID:{
    type: Sequelize.UUID,
    primaryKey: true
  },
  interest:{
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

var CompanyEvents = sequelize.define('companyEvents', {
  companyEventsID:{
    type: Sequelize.UUID,
    primaryKey: true
  },
  location:{
    type: Sequelize.TEXT
  },
  time:{
    type: Sequelize.DATE
  },
  speakers:{
    type: Sequelize.TEXT
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

//Ternary relation definition Company-CompanyEvents-LiveFair
Company.belongsToMany(LiveFair, {through: "company_companyEvents_liveFair"});
CompanyEvents.belongsToMany(LiveFair, {through: "company_companyEvents_liveFair"});
CompanyEvents.belongsToMany(Visitor, {through: "company_companyEvents_liveFair"});

//Ternary relation definition Company-Interest-LiveFair
Company.belongsToMany(LiveFair, {through: "company_interest_liveFair"});
Interest.belongsToMany(LiveFair, {through: "company_interest_liveFair"});
Interest.belongsToMany(Company, {through: "company_interest_liveFair"});

//Ternary relation definition Visitor-Interest-LiveFair
Visitor.belongsToMany(LiveFair, {through: "visitor_interest_liveFair"});
Interest.belongsToMany(Visitor, {through: "visitor_interest_liveFair"});
Interest.belongsToMany(LiveFair, {through: "visitor_interest_liveFair"});

sequelize.sync({force: true});
