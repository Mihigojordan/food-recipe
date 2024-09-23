const express = require('express');
const { addRecipe, getAllRecipes, getRecipeById, searchRecipes } = require('../Controllers/recipeController');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer configuration for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Route to add a recipe
router.post('/add', upload.single('image'), addRecipe);

// Route to get all recipes
router.get('/', getAllRecipes);
// Search route
router.get('/search', searchRecipes); // Search route for recipes

// Route to get recipe by ID
router.get('/:id', getRecipeById);



module.exports = router;