"use strict";

module.exports = function(sequelize, DataTypes) {
    var LiveFair = sequelize.define('liveFair', {
        liveFairID: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING, unique: true, allowNull: false
        },
        description: {
            type: DataTypes.STRING, allowNull: false
        },
        startDate: {
            type: DataTypes.DATE, allowNull: false
        },
		endDate: {
            type: DataTypes.DATE, allowNull: false
        },
        local: {
            type: DataTypes.STRING, allowNull: false
        },
        address: {
            type: DataTypes.STRING, allowNull: false
        },
        map: {
            type: DataTypes.STRING, allowNull: false
        },
        city: {
            type: DataTypes.STRING, allowNull: false
        },
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return LiveFair;
}