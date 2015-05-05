"use strict";

module.exports = function(sequelize, DataTypes) {
    var Visitor = sequelize.define('visitor', {
        visitorID:{
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false
        },
        Photo: {
            type: DataTypes.STRING, unique: true
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return Visitor;
}