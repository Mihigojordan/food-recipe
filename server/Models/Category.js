// models/Category.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config'); // Assuming you have a database configuration file

const Category = sequelize.define('Category', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dietaryPreferences: {
        type: DataTypes.STRING,
        allowNull: true, // Could be null if not applicable
    },
    imageUrl: {
        type: DataTypes.STRING, // Will store the path to the image
        allowNull: true,
    },
}, {
    timestamps: true,
});

module.exports = Category;