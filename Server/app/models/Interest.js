"use strict";

module.exports = function(sequelize, DataTypes) {
    var Interest = sequelize.define('interest', {
        interestID:{
            type: DataTypes.UUID,
            primaryKey: true
        },
        interest:{
            type: DataTypes.STRING, allowNull: false
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return Interest;
}