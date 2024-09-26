// models/Notification.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');

class Notification extends Model {}

Notification.init({
    message: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'Notification',
});

module.exports = Notification;