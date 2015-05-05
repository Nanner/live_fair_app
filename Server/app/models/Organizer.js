"use strict";

module.exports = function(sequelize, DataTypes) {
    var Organizer = sequelize.define('organizer', {
        organizerID:{
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false
        },
        organizerName: {
            type: DataTypes.STRING,
            unique: true
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return Organizer;
}