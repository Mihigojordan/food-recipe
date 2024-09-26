// routes/categoryRoutes.js
const express = require('express');
const { addCategory, getAllCategories, getCategoryById } = require('../Controllers/categoryController');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Path where images will be stored
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage });

// Route to add a new category, using multer for image upload
router.post('/categories', upload.single('image'), addCategory);


// Route to get all categories
router.get('/categories', getAllCategories);

router.get('/categories/:id', getCategoryById);

module.exports = router;