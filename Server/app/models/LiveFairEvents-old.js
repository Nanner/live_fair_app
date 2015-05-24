"use strict";

module.exports = function(sequelize, DataTypes) {
    var LiveFairEvents = sequelize.define('liveFairEvents', {
        liveFairEventID:{
            type: DataTypes.UUID,
            primaryKey: true
        },
        eventLocation: {
            type: DataTypes.STRING, allowNull: false
        },
        time: {
            type: DataTypes.DATE, allowNull: false
        },
        Speakers: {
            type: DataTypes.TEXT, allowNull: false
        },
        Subject: {
            type: DataTypes.TEXT, allowNull: false
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return LiveFairEvents;
}