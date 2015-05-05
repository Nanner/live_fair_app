"use strict";
var models = require('../models');

module.exports = function(sequelize, DataTypes) {
    var LiveFairCompanyInterest = sequelize.define('liveFairCompanyInterest', {
        liveFairIDref: {
            type: DataTypes.UUID,
            references: models.LiveFair, // Can be both a string representing the table name, or a reference to the model
            referencesKey: "liveFairID",
            onDelete: 'CASCADE'
        },
        companyIDref: {
            type: DataTypes.UUID,
            references: models.Company, // Can be both a string representing the table name, or a reference to the model
            referencesKey: "companyID",
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

    return LiveFairCompanyInterest;
}
