const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config');

class Notification extends Model {}

Notification.init({
    recipeName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    recipeImage: {
        type: DataTypes.STRING, // recipeImage can be NULL
        allowNull: true,
    },
    scheduledTime: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'pending', // Default value is 'pending'
    },
    expoPushToken: {
        type: DataTypes.STRING, // Add the expoPushToken field
        allowNull: true, // Ensure that expoPushToken cannot be NULL
    },
}, {
    sequelize,
    modelName: 'Notification',
});

module.exports = Notification;