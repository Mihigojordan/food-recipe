const express = require('express');
const { getAllCulturalOrigins, getRecipeById } = require('../Controllers/categoryController'); // Import the new function
const router = express.Router();

// Route to get all unique cultural origins as categories
router.get('/categories', getAllCulturalOrigins);

// If you still need to get a recipe by ID, keep this route
router.get('/recipes/:id', getRecipeById); // Updated to reflect that it's for recipes

module.exports = router;