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
router.get('/user/:username', async (req,res) => {
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
router.get('/ranking', async (req,res) => {
    try {

        const username = req.params.username;

        // Querying using sequelize findOne method
        const usersSortedByCorrectAnswers = await User.findAll({
            order: [['correctly_answered_questions', 'DESC']]
        });


        console.log(usersSortedByCorrectAnswers);

        // Converting each user to a JSON object
        const sortedUsersJSON = usersSortedByCorrectAnswers.map(user => user.toJSON());

        // Returned object in response, it contains a list of JSON objects (each user)
        const allSortedUsersJSON = {
            users: sortedUsersJSON
        };

        res.json(allSortedUsersJSON);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

});




//Get Groups

//Get group by name











module.exports = router;