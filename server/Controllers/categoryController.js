// controllers/categoryController.js
const Category = require('../Models/Category');

// Add a new category
const addCategory = async(req, res) => {
    const { name, description, type, dietaryPreferences } = req.body;
    const imageUrl = req.file ? req.file.filename : null; // Get the uploaded image filename

    try {
        const newCategory = await Category.create({
            name,
            description,
            type,
            dietaryPreferences,
            imageUrl,
        });

        res.status(201).json({
            message: 'Category created successfully',
            category: newCategory,
        });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ message: 'Failed to create category', error: error.message });
    }
};

// Get all categories
const getAllCategories = async(req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a category by ID
const getCategoryById = async(req, res) => {
    const { id } = req.params; // Get the category ID from the request parameters

    try {
        const category = await Category.findOne({ where: { id } });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category);
    } catch (error) {
        console.error('Error fetching category by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { addCategory, getAllCategories, getCategoryById };