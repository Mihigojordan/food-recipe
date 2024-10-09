const express = require('express');
const Notification = require('../Models/Notification');
const router = express.Router();
const cron = require('node-cron');
const { Op } = require('sequelize');
const axios = require('axios'); // Import axios for sending requests

// Create a notification
router.post('/alarm', async(req, res) => {
    const { recipeName, recipeImage, scheduleTime, expoPushToken } = req.body; // Include expoPushToken

    try {
        // // Ensure recipeName, scheduleTime, and expoPushToken are not null
        // if (!recipeName || !scheduleTime || !expoPushToken) {
        //     return res.status(400).json({ error: 'Recipe name, scheduled time, and Expo push token are required' });
        // }

        // Create the notification in the database
        const notification = await Notification.create({
            recipeName,
            recipeImage,
            scheduledTime: new Date(scheduleTime),
            status: 'pending',
            expoPushToken, // Save the token
        });

        res.status(200).json(notification); // Send success response
    } catch (error) {
        console.error('Error saving notification:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Retrieve all notifications
router.get('/notifications', async(req, res) => {
    try {
        const notifications = await Notification.findAll();
        res.status(200).json(notifications); // Send the notifications as response
    } catch (error) {
        console.error('Error retrieving notifications:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Scheduler: Check for notifications every minute
cron.schedule('* * * * *', async() => {
    console.log('Checking for scheduled notifications...');

    try {
        const now = new Date();

        const notifications = await Notification.findAll({
            where: {
                scheduledTime: {
                    [Op.lte]: now,
                },
                status: 'pending',
            }
        });

        // Use for...of loop for async operations
        for (const notification of notifications) {
            console.log(`Time to send notification for recipe: ${notification.recipeName}`);

            // Send notification via Expo's Push Notification Service
            const message = {
                to: notification.expoPushToken,
                sound: 'default',
                title: notification.recipeName,
                body: `It's time to cook ${notification.recipeName}!`,
                data: { recipeImage: notification.recipeImage },
            };

            try {
                const response = await axios.post('https://exp.host/--/api/v2/push/send', message);
                console.log('Notification response:', response.data);

                // Check the response for success
                if (response.data.status === 'ok') {
                    // Mark the notification as 'sent'
                    notification.status = 'sent';
                } else {
                    // Handle errors returned from the notification service
                    console.error('Notification service error:', response.data);
                    notification.status = 'failed'; // Mark as failed
                }
            } catch (err) {
                console.error('Error sending notification:', err);
                notification.status = 'failed'; // Mark as failed
            }

            await notification.save(); // Save notification status
        }
    } catch (error) {
        console.error('Error checking notifications:', error);
    }
});

module.exports = router;