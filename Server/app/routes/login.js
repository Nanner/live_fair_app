'use strict';

var User = require('../models/User'),
    Boom = require('boom'),
    jwt = require('jsonwebtoken'),
    crypto = require("crypto"),
    uuid = require('node-uuid'),
    sequelize = require('../models').sequelize;

var User = require('../models').User,
    Company = require('../models').Company,
    Visitor = require('../models').Visitor,
    Organizer = require('../models').Organizer;

var privateKey = 'ORochaApagouADriveDoMatias';
// var tokenTTL = 7200;

module.exports = function(server) {

    var validate = function(decodedToken, callback) {
        var error;
        User.find({
            where: {email: decodedToken.email}
        }).then(function(account) {
            if(!account) {
                return callback(error, false, {});
            }
            return callback(error, true, account);
        }).catch(function(error) {
            return callback(error, false, {});
        });
    };

    server.register(require('hapi-auth-jwt'), function (error) {
        server.auth.strategy('token', 'jwt', {
            key: privateKey,
            validateFunc: validate
        });
    });

    server.route({
        method: 'POST',
        path: '/login',
        config:{
            auth: false,
            handler: function (request, reply) {
                if (request.method === 'post') {
                    if (!request.payload.username ||
                        !request.payload.password) {
                        return reply(Boom.badRequest('Missing username or password'));
                    }
                    else {
                        User.find({where:
                        {
                            email: request.payload.username
                        }}).then(function(account) {
                            if(!account) {
                                return reply(Boom.unauthorized('Invalid username or password'));
                            }
                            else {
                                var passHash=crypto.createHash('sha512');
                                passHash.update(request.payload.password);
                                if (account.password !== passHash.digest('hex')) {
                                    return reply(Boom.unauthorized('Invalid username or password'));
                                }
                                else {
                                    var token = jwt.sign(account.email, privateKey);
                                    return reply({userID: account.userID, email: account.email, type: account.type, token: token});
                                }
                            }
                        }).catch(function(error) {
                            return reply(Boom.badImplementation(error));
                        })
                    }
                }

            }
        }
    });

};