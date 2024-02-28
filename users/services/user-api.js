const express = require('express');
const router = express.Router();
const { User } = require('../models/user-model');

//Get all users
router.get('/allUsers', async (req,res) => {

    try {

        const allUsers = await User.findAll();

        // Converting each user to a JSON object
        const usersJSON = allUsers.map(user => user.toJSON());

        // Returned object in response, it contains a list of JSON objects (each user)
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
    try {

        const username = req.params.username;

        // Querying using sequelize findOne method
        const user = await User.findOne({
            where: {
                username: username
            }
        });
        
        const userJSON = user.toJSON();
        res.json(userJSON);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

});

//Get users ordered by correct answers

//Get Groups

//Get group by name




























module.exports = router;