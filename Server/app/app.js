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

  // SQLite only
  storage: 'path/to/database.sqlite'
});

var server = new Hapi.Server();
server.connection({ port: 3000 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply('Hello, world!');
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
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
  username: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.STRING
  },
  contact: {
    type: Sequelize.STRING
  },
  address: {
    type: Sequelize.TEXT
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
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

var Company = sequelize.define('company', {
  companyName: {
    type: Sequelize.STRING,
  },
  logoImage: {
    type: Sequelize.STRING
  },
  website: {
    type: Sequelize.STRING
  },
  visitorCounter: {
    type: Sequelize.INTEGER
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

var Visitor = sequelize.define('visitor', {
  Photo: {
    type: Sequelize.STRING,
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

var LiveFair = sequelize.define('liveFair', {
  name: {
    type: Sequelize.STRING,
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

var LiveFairEvents = sequelize.define('liveFairEvents', {
  eventLocation: {
    type: Sequelize.STRING,
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
