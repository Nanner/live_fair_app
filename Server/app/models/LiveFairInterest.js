"use strict";

module.exports = function(sequelize, DataTypes) {
    var LiveFairInterest = sequelize.define('liveFairInterest', {
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return LiveFairInterest;
}