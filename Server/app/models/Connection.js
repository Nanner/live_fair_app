"use strict";

module.exports = function(sequelize, DataTypes) {
    var Connection = sequelize.define('connection', {
        liked:{
            type: DataTypes.BOOLEAN, allowNull: false
        },
		sharedContact:{
            type: DataTypes.BOOLEAN, allowNull: false
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return Connection;
}