const express = require('express');
const router = express.Router();
const Preference = require('../Models/Preference');
const User = require('../Models/User');
const { authenticateToken } = require('../middleware/auth');

// Get all preferences
router.get('/preferences', async (req, res) => {
    try {
        const preferences = await Preference.findAll({
            attributes: ['id', 'name', 'description']
        });
        res.json(preferences);
    } catch (error) {
        console.error('Error fetching preferences:', error);
        res.status(500).json({ error: 'Failed to fetch preferences' });
    }
});

// Get user's preferences
router.get('/user/preferences', authenticateToken, async (req, res) => {
    try {
        const preferences = await Preference.findAll({
            where: { userId: req.user.id }
        });
        res.json(preferences);
    } catch (error) {
        console.error('Error fetching user preferences:', error);
        res.status(500).json({ error: 'Failed to fetch user preferences' });
    }
});

// Add preferences for user
router.post('/preferences', authenticateToken, async (req, res) => {
    try {
        const { preferences } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create preferences for the user
        const createdPreferences = await Promise.all(
            preferences.map(pref => 
                Preference.create({
                    name: pref,
                    userId: user.id
                })
            )
        );

        res.status(201).json(createdPreferences);
    } catch (error) {
        console.error('Error adding preferences:', error);
        res.status(500).json({ error: 'Failed to add preferences' });
    }
});

// Update user's preferences
router.put('/preferences', authenticateToken, async (req, res) => {
    try {
        const { preferences } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete existing preferences
        await Preference.destroy({
            where: { userId: user.id }
        });

        // Create new preferences
        const createdPreferences = await Promise.all(
            preferences.map(pref => 
                Preference.create({
                    name: pref,
                    userId: user.id
                })
            )
        );

        res.json(createdPreferences);
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({ error: 'Failed to update preferences' });
    }
});

// Delete a preference
router.delete('/preferences/:id', authenticateToken, async (req, res) => {
    try {
        const preference = await Preference.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!preference) {
            return res.status(404).json({ error: 'Preference not found' });
        }

        await preference.destroy();
        res.json({ message: 'Preference deleted successfully' });
    } catch (error) {
        console.error('Error deleting preference:', error);
        res.status(500).json({ error: 'Failed to delete preference' });
    }
});

module.exports = router; 