"use strict";

module.exports = function(sequelize, DataTypes) {
    var LiveFairEvents = sequelize.define('liveFairEvents', {
        eventLocation: {
            type: DataTypes.STRING, allowNull: false
        },
		startTime: {
            type: DataTypes.DATE, allowNull: false
        },
		endTime:{
            type: DataTypes.DATE, allowNull: false
        },
        speakers: {
            type: DataTypes.TEXT, allowNull: false
        },
        subject: {
            type: DataTypes.TEXT, allowNull: false
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return LiveFairEvents;
}