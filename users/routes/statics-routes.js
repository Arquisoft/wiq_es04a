const express = require('express');
const router = express.Router();
const { Statics } = require('../models/user-model');

//Group internal routes
const apiRoutes = require('../services/statics-api');

// Route for edit the statics of a user
router.post('/edit', async (req, res) => {
    try {

        const { userId, earned_money, classic_correctly_answered_questions, classic_incorrectly_answered_questions, 
            classic_total_time_played, classic_games_played } = req.body;

        // Find the user in the database by their username
        const staticsUserToUpdate = await Statics.findOne({
            where: {
                userId: userId
            }
        });

        // Check if the user exists
        if (!staticsUserToUpdate) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user's fields with the provided values
        staticsUserToUpdate.earned_money = staticsUserToUpdate.earned_money  + earned_money;
        staticsUserToUpdate.classic_correctly_answered_questions = staticsUserToUpdate.classic_correctly_answered_questions 
        + classic_correctly_answered_questions;
        staticsUserToUpdate.classic_incorrectly_answered_questions = staticsUserToUpdate.classic_incorrectly_answered_questions 
        + classic_incorrectly_answered_questions;
        staticsUserToUpdate.classic_total_time_played = staticsUserToUpdate.classic_total_time_played + classic_total_time_played;
        staticsUserToUpdate.classic_games_played = staticsUserToUpdate.classic_games_played + classic_games_played;

        // Save the changes to the database
        await staticsUserToUpdate.save();

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