"use strict";

module.exports = function(sequelize, DataTypes) {
    var CompanyEvents = sequelize.define('companyEvents', {
        companyEventsID:{
            type: DataTypes.UUID,
            primaryKey: true
        },
        location:{
            type: DataTypes.TEXT, allowNull: false
        },
        startTime:{
            type: DataTypes.DATE, allowNull: false
        },
		endTime:{
            type: DataTypes.DATE, allowNull: false
        },
        speakers:{
            type: DataTypes.TEXT, allowNull: false
        },
        subject:{
            type: DataTypes.TEXT, allowNull: false
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return CompanyEvents;
}