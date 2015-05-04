var Hapi = require('hapi');
var Good = require('good');
var Sequelize = require('sequelize');

var sequelize = new Sequelize('liveFairAppDB', 'postgres', 'root', {
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

var User = sequelize.define('user', {
  userID:{
    type: Sequelize.UUID,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING, unique: true, allowNull: false
  },
  password: {
    type: Sequelize.STRING, allowNull: false
  },
  type: {
    type: Sequelize.STRING, allowNull: false
  },
  contact: {
    type: Sequelize.STRING
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
  organizerID:{
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  },
  organizerName: {
  type: Sequelize.STRING, 
  unique: true
}
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

Organizer.belongsTo(User, {foreignKey: 'organizerID'});

var Company = sequelize.define('company', {
  companyID:{
    type: Sequelize.UUID,
    primaryKey: true, 
    allowNull: false
  },
  companyName: {
    type: Sequelize.STRING, unique: true, allowNull: false
  },
  logoImage: {
    type: Sequelize.STRING, unique: true, allowNull: false
  },
  website: {
    type: Sequelize.STRING, unique: true, allowNull: false
  },
  visitorCounter: {
    type: Sequelize.INTEGER
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

Company.belongsTo(User, {foreignKey: 'companyID'});

var Visitor = sequelize.define('visitor', {
  visitorID:{
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false
  },
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
    type: Sequelize.STRING, unique: true, allowNull: false
  },
  description: {
    type: Sequelize.STRING, allowNull: false
  },
  date: {
    type: Sequelize.DATE, allowNull: false
  },
  location: {
    type: Sequelize.STRING, allowNull: false
  },
  map: {
    type: Sequelize.STRING, allowNull: false
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

Visitor.belongsToMany(LiveFair, {through: "visitor_liveFair"});
LiveFair.belongsToMany(Visitor, {through: "visitor_liveFair"});
Organizer.hasMany(LiveFair);

var LiveFairEvents = sequelize.define('liveFairEvents', {
  eventLocation: {
    type: Sequelize.STRING, allowNull: false
  },
  time: {
    type: Sequelize.DATE, allowNull: false
  },
  Speakers: {
    type: Sequelize.TEXT, allowNull: false
  },
  Subject: {
    type: Sequelize.TEXT, allowNull: false
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
    type: Sequelize.STRING, allowNull: false
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
    type: Sequelize.TEXT, allowNull: false
  },
  time:{
    type: Sequelize.DATE, allowNull: false
  },
  speakers:{
    type: Sequelize.TEXT, allowNull: false
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

var Stands = sequelize.define('stands', {
  standLocation:{
    type: Sequelize.TEXT, allowNull: false
  },
  approved:{
    type: Sequelize.BOOLEAN, allowNull: false
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

Company.belongsToMany(LiveFair, {through: "stands"});
LiveFair.belongsToMany(Company , {through: "stands"});

var Connection = sequelize.define('connection', {
  like:{
    type: Sequelize.BOOLEAN, allowNull: false
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

var LiveFairCompanyEvents = sequelize.define('liveFairCompanyEvents', {
  liveFairIDref: {
    type: Sequelize.UUID,
    references: LiveFair, // Can be both a string representing the table name, or a reference to the model
    referencesKey: "liveFairID",
    onDelete: 'CASCADE'
  },
  companyIDref: {
    type: Sequelize.UUID,
    references: Company, // Can be both a string representing the table name, or a reference to the model
    referencesKey: "companyID",
    onDelete: 'CASCADE'
  },
  companyEventsIDref: {
    type: Sequelize.UUID,
    references: CompanyEvents, // Can be both a string representing the table name, or a reference to the model
    referencesKey: "companyEventsID",
    onDelete: 'CASCADE'
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

var LiveCompanyInterest = sequelize.define('liveFairCompanyInterest', {
    liveFairIDref: {
    type: Sequelize.UUID,
    references: LiveFair, // Can be both a string representing the table name, or a reference to the model
    referencesKey: "liveFairID",
    onDelete: 'CASCADE'
  },
  companyIDref: {
    type: Sequelize.UUID,
    references: Company, // Can be both a string representing the table name, or a reference to the model
    referencesKey: "companyID",
    onDelete: 'CASCADE'
  },
  interestIDref: {
    type: Sequelize.UUID,
    references: Interest, // Can be both a string representing the table name, or a reference to the model
    referencesKey: "interestID",
    onDelete: 'CASCADE'
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

var Connection = sequelize.define('liveFairVisitorInterest', {
    liveFairIDref: {
    type: Sequelize.UUID,
    references: LiveFair, // Can be both a string representing the table name, or a reference to the model
    referencesKey: "liveFairID",
    onDelete: 'CASCADE'
  },
  visitorIDref: {
    type: Sequelize.UUID,
    references: Visitor, // Can be both a string representing the table name, or a reference to the model
    referencesKey: "visitorID",
    onDelete: 'CASCADE'
  },
  interestIDref: {
    type: Sequelize.UUID,
    references: Interest, // Can be both a string representing the table name, or a reference to the model
    referencesKey: "interestID",
    onDelete: 'CASCADE'
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

//liked table
Company.belongsToMany(Visitor, {through: "connection"});
Visitor.belongsToMany(Company, {through: "connection"});

//connection between LiveFair and Interest
Interest.belongsTo(LiveFair, {through: "liveFairInterest"});
LiveFair.belongsToMany(Interest, {through: "liveFairInterest"});

sequelize.sync({force: true});
