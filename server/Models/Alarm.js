// models/Alarm.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');

class Alarm extends Model {}

Alarm.init({
    recipe_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'recipes', // Reference to the recipes table
            key: 'id'
        }
    },
    preparation_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    notification_time: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Alarm',
});

module.exports = Alarm;