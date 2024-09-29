const axios = require('axios');
const Recipe = require('../Models/Recipe'); // Adjust the path as needed

const EDAMAM_APP_ID = "96668a25"; // Your Edamam Application ID
const EDAMAM_APP_KEY = "6b36479652f2a371c3fa2c030af5f7dc"; // Your Edamam Application Key

const getRecipeSuggestions = async(ingredients) => {
    const url = "https://api.edamam.com/search";
    const params = {
        q: ingredients.join(','),
        app_id: EDAMAM_APP_ID,
        app_key: EDAMAM_APP_KEY,
        from: 0,
        to: 10,
    };

    try {
        const response = await axios.get(url, { params });
        return response.data.hits.map(hit => ({
            name: hit.recipe.label,
            description: hit.recipe.label, // You can customize this as needed
            culturalOrigin: hit.recipe.cuisineType.join(', '), // This is an example; adjust as needed
            tags: hit.recipe.dishType.join(', '), // Tags can be derived from dish types
            ingredients: hit.recipe.ingredientLines,
            imageUrl: hit.recipe.image,
            cookingTime: hit.recipe.totalTime ? `${hit.recipe.totalTime} minutes` : 'N/A',
        }));
    } catch (error) {
        console.error("Error fetching recipes:", error);
        throw new Error("Could not fetch recipes");
    }
};

const saveRecipes = async(recipes) => {
    const promises = recipes.map(recipe => Recipe.create(recipe));
    await Promise.all(promises);
};

const fetchAndSaveRecipes = async(req, res) => {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: "No valid ingredients provided." });
    }

    try {
        const recipeSuggestions = await getRecipeSuggestions(ingredients);
        await saveRecipes(recipeSuggestions);
        return res.status(200).json(recipeSuggestions);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    fetchAndSaveRecipes,
};