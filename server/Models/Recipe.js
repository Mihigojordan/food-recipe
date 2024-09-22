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
        type: DataTypes.JSONB, // Storing ingredients as an array
    },
    imageUrl: {
        type: DataTypes.STRING, // To store the uploaded image path
    },
});

module.exports = Recipe;