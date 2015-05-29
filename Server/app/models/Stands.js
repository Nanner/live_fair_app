"use strict";

module.exports = function(sequelize, DataTypes) {
    var Stands = sequelize.define('stands', {
        standLocation:{
            type: DataTypes.TEXT
        },
        approved:{
            type: DataTypes.BOOLEAN, allowNull: false
        },
        visitorCounter:{
            type: DataTypes.INTEGER, allowNull:false
        }
    }, {
        freezeTableName: true // Model tableName will be the same as the model name
    });

    return Stands;
};