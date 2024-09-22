const { DataTypes } = require('sequelize');
const sequelize = require('../config/config'); // Assuming a configured database connection

const Recipe = sequelize.define('Recipe', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    culturalOrigin: {
        type: DataTypes.STRING,
    },
    tags: {
        type: DataTypes.STRING,
    },
    ingredients: {
        type: DataTypes.JSON, // Correcting to JSON for MySQL/MariaDB compatibility
    },
    imageUrl: {
        type: DataTypes.STRING, // To store the uploaded image path
    },
});

module.exports = Recipe;