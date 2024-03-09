const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models/user-model');

//User internal routes
const apiRoutes = require('../services/user-api');

// Route for add a user
router.post('/add', async (req, res) => {
    try {
        const { username, password, name, surname, imageUrl } = req.body;

        const user = await User.findOne({ where: { username } });

        if (user != null) {
            throw new Error('An account with that username already exists');
        }

        // Password validation
        if (password.length < 8) {
            throw new Error('The password must be at least 8 characters long');
        }
        if (!/\d/.test(password)) {
            throw new Error('The password must contain at least one numeric character');
        }
        if (!/[A-Z]/.test(password)) {
            throw new Error('The password must contain at least one uppercase letter');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database using Sequelize
        const newUser = await User.create({
            username,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
            name,
            surname,
            imageUrl,
        });

        res.json(newUser);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            // validation errors
            const validationErrors = error.errors.map(err => err.message);
            res.status(400).json({ error: 'Error de validación', details: validationErrors });
        } else {
            // Other errors
            res.status(400).json({ error: error.message });
        }
    }
});

// Route for edit a user
router.post('/edit', async (req, res) => {
    try {

        const { username, total_score, correctly_answered_questions, incorrectly_answered_questions, total_time_played, games_played } = req.body;

        // Find the user in the database by their username
        const userToUpdate = await User.findOne({
            where: {
                username: username
            }
        });

        // Check if the user exists
        if (!userToUpdate) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user's fields with the provided values
        userToUpdate.total_score = userToUpdate.total_score + total_score;
        userToUpdate.correctly_answered_questions = userToUpdate.correctly_answered_questions + correctly_answered_questions;
        userToUpdate.incorrectly_answered_questions = userToUpdate.incorrectly_answered_questions + incorrectly_answered_questions;
        userToUpdate.total_time_played = userToUpdate.total_time_played + total_time_played;
        userToUpdate.games_played = userToUpdate.games_played + games_played;

        // Save the changes to the database
        await userToUpdate.save();

        res.json({ message: 'User updated successfully' });
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