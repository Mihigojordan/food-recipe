const Recipe = require('../Models/Recipe');
const { Op } = require('sequelize'); // Import Sequelize operators
require('dotenv').config();

// Add a new recipe
const addRecipe = async(req, res) => {
    console.log("searchRecipes function called"); // Confirm function call
    const { query } = req.query;
    console.log('Received Query:', query);
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
        console.error('Error adding recipe:', error);
        res.status(500).json({ message: 'Failed to create recipe' });
    }
};

// Get all recipes
const getAllRecipes = async(req, res) => {
    try {
        const recipes = await Recipe.findAll();
        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
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
        console.error('Error fetching recipe by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const searchRecipes = async(req, res) => {
    const { query } = req.query; // Get the search query from the query parameters

    // Log the received query
    console.log('Received Query:', query);

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    try {
        // Fetch all recipes for logging
        const allRecipes = await Recipe.findAll();
        console.log('All Recipes:', JSON.stringify(allRecipes, null, 2)); // Log all recipes

        // Search for recipes based only on the name
        const recipes = await Recipe.findAll({
            where: {
                name: {
                    [Op.like]: `%${query}%`
                }
            }
        });

        // Log the search results
        console.log('Search Results:', JSON.stringify(recipes, null, 2)); // Log found recipes

        if (recipes.length === 0) {
            return res.status(404).json({ message: 'No recipes found' });
        }

        res.status(200).json(recipes);
    } catch (error) {
        console.error('Error searching recipes:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { addRecipe, getAllRecipes, getRecipeById, searchRecipes };