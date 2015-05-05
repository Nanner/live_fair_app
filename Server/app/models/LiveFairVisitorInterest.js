"use strict";
var models = require('../models');

module.exports = function(sequelize, DataTypes) {
    var LiveFairVisitorInterest = sequelize.define('liveFairVisitorInterest', {
        liveFairIDref: {
            type: DataTypes.UUID,
            references: models.LiveFair, // Can be both a string representing the table name, or a reference to the model
            referencesKey: "liveFairID",
            onDelete: 'CASCADE'
        },
        visitorIDref: {
            type: DataTypes.UUID,
            references: models.Visitor, // Can be both a string representing the table name, or a reference to the model
            referencesKey: "visitorID",
            onDelete: 'CASCADE'
        },
        interestIDref: {
            type: DataTypes.UUID,
            references: models.Interest, // Can be both a string representing the table name, or a reference to the model
            referencesKey: "interestID",
            onDelete: 'CASCADE'
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return LiveFairVisitorInterest;
}
