const Recipe = require('../Models/Recipe'); // Ensure you import the Recipe model

// Get all unique cultural origins and image URLs from the recipes table
const getAllCulturalOrigins = async(req, res) => {
    try {
        // Fetch unique cultural origins and their corresponding image URLs from the recipes table
        const recipes = await Recipe.findAll({
            attributes: ['culturalOrigin', 'imageUrl'], // Select culturalOrigin and imageUrl
            group: ['culturalOrigin', 'imageUrl'], // Group by both culturalOrigin and imageUrl to get unique combinations
        });

        // Map the results to extract cultural origins and image URLs
        const culturalOrigins = recipes.map(recipe => ({
            culturalOrigin: recipe.culturalOrigin,
            imageUrl: recipe.imageUrl,
        }));

        res.status(200).json(culturalOrigins);
    } catch (error) {
        console.error('Error fetching cultural origins:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a recipe by ID (if needed in future)
const getRecipeById = async(req, res) => {
    const { id } = req.params; // Get the recipe ID from the request parameters

    try {
        const recipe = await Recipe.findOne({ where: { id } });

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.status(200).json(recipe);
    } catch (error) {
        console.error('Error fetching recipe by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAllCulturalOrigins, getRecipeById };