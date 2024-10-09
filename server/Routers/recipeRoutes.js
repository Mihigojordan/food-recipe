const express = require('express');
const { fetchAndSaveRecipes, searchRecipeSuggestions, getAllRecipes } = require('../Controllers/recipeController'); // Adjust the path as needed

const router = express.Router();

router.post('/recipes', fetchAndSaveRecipes);
router.get('/recipes', getAllRecipes);
router.post('/searchRecipes', async(req, res) => {
    const { type, query } = req.body; // Expecting type and query from the request body
    try {
        const results = await searchRecipeSuggestions({ type, query });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;