"use strict";

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('user', {
        userID:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING, unique: true, allowNull: false
        },
        password: {
            type: DataTypes.STRING, allowNull: false
        },
        type: {
            type: DataTypes.STRING, allowNull: false
        },
        contact: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.TEXT
        },
        blocked: {
            type: DataTypes.BOOLEAN
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return User;
}