"use strict";

module.exports = function(sequelize, DataTypes) {
    var Company = sequelize.define('company', {
        companyID:{
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false
        },
        companyName: {
            type: DataTypes.STRING, unique: true
        },
        logoImage: {
            type: DataTypes.STRING, unique: true
        },
        address: {
            type: DataTypes.TEXT
        },
        website: {
            type: DataTypes.STRING, unique: true
        },
        visitorCounter: {
            type: DataTypes.INTEGER
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return Company;
}