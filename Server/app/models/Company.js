"use strict";

module.exports = function(sequelize, DataTypes) {
    var Company = sequelize.define('company', {
        companyID:{
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false
        },
        companyName: {
            type: DataTypes.STRING, unique: true, allowNull: false
        },
        logoImage: {
            type: DataTypes.STRING, unique: true, allowNull: false
        },
        website: {
            type: DataTypes.STRING, unique: true, allowNull: false
        },
        visitorCounter: {
            type: DataTypes.INTEGER
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return Company;
}