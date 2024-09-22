const Recipe = require('../Models/Recipe');
const path = require('path');

// Add a new recipe
const addRecipe = async(req, res) => {
    try {
        const { name, description, culturalOrigin, tags, ingredients } = req.body;
        const imageUrl = req.file ? req.file.filename : null; // Get uploaded image

        const newRecipe = await Recipe.create({
            name,
            description,
            culturalOrigin,
            tags,
            ingredients,
            imageUrl,
        });

        res.status(201).json({ message: 'Recipe created successfully', recipe: newRecipe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all recipes
const getAllRecipes = async(req, res) => {
    try {
        const recipes = await Recipe.findAll();
        res.status(200).json(recipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get recipe by ID
const getRecipeById = async(req, res) => {
    try {
        const recipe = await Recipe.findByPk(req.params.id);

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.status(200).json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addRecipe, getAllRecipes, getRecipeById };