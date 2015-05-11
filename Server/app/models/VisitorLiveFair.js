"use strict";

module.exports = function(sequelize, DataTypes) {
    var visitorLiveFair = sequelize.define('visitor_liveFair', {
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return LiveFairInterest;
}