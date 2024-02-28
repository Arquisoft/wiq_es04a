const express = require('express');
const router = express.Router();
const { User } = require('../models/user-model');

//Get all users
router.get('/users', async (req,res) => {

    try {

        const allUsers = await User.findAll();

        // Convertir los usuarios a formato JSON
        const usersJSON = allUsers.map(user => user.toJSON());

        const allUsersJSON = {
            users: usersJSON
        };

        res.json(allUsersJSON);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Get user by username

router.get('/users/:username', async (req,res) => {


});

//Get users ordered by correct answers

//Get Groups

//Get group by name




























module.exports = router;