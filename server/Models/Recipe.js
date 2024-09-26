const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/config'); // Adjust the path as needed

class Recipe extends Model {}

Recipe.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    culturalOrigin: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tags: {
        type: DataTypes.STRING,
    },
    ingredients: {
        type: DataTypes.JSON, // Assuming ingredients is a JSON object
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
    },
    cookingTime: { // New field for cooking time
        type: DataTypes.STRING,
        allowNull: false, // Adjust as necessary
    },
}, {
    sequelize,
    modelName: 'Recipe',
});

module.exports = Recipe;