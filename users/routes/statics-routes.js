const express = require('express');
const router = express.Router();
const { Statistics } = require('../models/user-model');

//Group internal routes
const apiRoutes = require('../services/statics-api');

// Route for edit the statics of a user
router.post('/edit', async (req, res) => {
    try {

        const { username, earned_money, classic_correctly_answered_questions, classic_incorrectly_answered_questions, 
            classic_total_time_played, classic_games_played } = req.body;

        // Find the user in the database by their username
        const statisticsUserToUpdate = await Statistics.findOne({
            where: {
                username: username
            }
        });

        // Check if the user exists
        if (!statisticsUserToUpdate) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user's fields with the provided values
        statisticsUserToUpdate.earned_money = statisticsUserToUpdate.earned_money  + earned_money;
        statisticsUserToUpdate.classic_correctly_answered_questions = statisticsUserToUpdate.classic_correctly_answered_questions 
        + classic_correctly_answered_questions;
        statisticsUserToUpdate.classic_incorrectly_answered_questions = statisticsUserToUpdate.classic_incorrectly_answered_questions 
        + classic_incorrectly_answered_questions;
        statisticsUserToUpdate.classic_total_time_played = statisticsUserToUpdate.classic_total_time_played + classic_total_time_played;
        statisticsUserToUpdate.classic_games_played = statisticsUserToUpdate.classic_games_played + classic_games_played;

        // Save the changes to the database
        await statisticsUserToUpdate.save();

        res.json({ message: 'User statics updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);

        if (error.name === 'SequelizeValidationError') {
            // Validation errors
            const validationErrors = error.errors.map(err => err.message);
            res.status(400).json({ error: 'Validation error', details: validationErrors });
        } else {
            // Other errors
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
});

//Api middleware
router.use('/api', apiRoutes);

module.exports = router;