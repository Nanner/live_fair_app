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
        date: {
            type: DataTypes.DATE, allowNull: false
        },
        location: {
            type: DataTypes.STRING, allowNull: false
        },
        map: {
            type: DataTypes.STRING, allowNull: false
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return LiveFair;
}