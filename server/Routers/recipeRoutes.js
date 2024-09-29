const express = require('express');
const { fetchAndSaveRecipes } = require('../Controllers/recipeController'); // Adjust the path as needed

const router = express.Router();

router.post('/recipes', fetchAndSaveRecipes);

module.exports = router;