const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, Statistics, Group, UserGroup, QuestionsRecord, sequelize } = require('../services/user-model');

// Route for add a question to questions record
router.post('/questionsRecord', async (req, res) => {
    try {
        const { username, questions, gameMode} = req.body;

        // Create new question 
        const newQuestionRecord = await QuestionsRecord.create({
            questions,
            username,
            gameMode,
        });

        res.json(newQuestionRecord);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Getting a questions record by username
router.get('/questionsRecord/:username/:gameMode', async (req, res) => {
    try {
        const username = req.params.username;
        const gameMode = req.params.gameMode;

        // Need also to get the group members
        const record = await QuestionsRecord.findOne({
            where: {
                username: username,
                gameMode: gameMode
            }
        });
        if (!record) {
            return res.status(404).json({ error: 'No record found' });
        }

        res.json(record);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});

// Route for add a user
router.post('/add', async (req, res) => {
    try {
        const { username, password, name, surname } = req.body;

        const user = await User.findOne({ where: { username } });

        if (user != null) {
            throw new Error('An account with that username already exists');
        }

        // Email validation
        if (username.trim().length < 4) {
            throw new Error('The username must be at least 4 characters long');
        }

        // Password validation
        if (password.trim().length < 8) {
            throw new Error('The password must be at least 8 characters long');
        }
        if (!/\d/.test(password)) {
            throw new Error('The password must contain at least one numeric character');
        }
        if (!/[A-Z]/.test(password)) {
            throw new Error('The password must contain at least one uppercase letter');
        }

        // Name validation
        if (!name.trim()) {
            throw new Error('The name cannot be empty or contain only spaces');
        }
        
        // Surname validation
        if (!surname.trim()) {
            throw new Error('The surname cannot be empty or contain only spaces');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database using Sequelize
        const newUser = await User.create({
            username,
            password: hashedPassword,
            name,
            surname
        });

        // Create the user statics
        await Statistics.create({
            username,
        })

        res.json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// router.post('/logout', async (req, res) => {
//     try {

//       req.session.username = null;
//     } catch (error) {
//       return res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });


// router.get('/session', async (req, res) => {
//     res.json({ session: req.session });
// });


// Getting the list of groups in the database
router.get('/group/list', async (req, res) => {
    try {

        const username = req.query.username;

        // If the user is null or undefined (no one is logged, return all groups)
        if (username === null || username === undefined) {
            const allGroups = await Group.findAll({ order: [['name', 'ASC']] });
            const groupsJSON = await Promise.all(allGroups.map(async (group) => {
                const userCount = await UserGroup.count({
                    where: {
                        groupName: group.name
                    }
                });
                return {
                    name: group.name,
                    isMember: false,
                    isFull: userCount === 20
                };
            }));
            return res.json({ groups: groupsJSON });
        }

        // If someone is logged, return the groups indicating which one the user has joined
        const userGroups = await UserGroup.findAll({
            where: {
              username: username
            }
        });
        const userGroupNames = userGroups.map(userGroup => userGroup.groupName);

        const allGroups = await Group.findAll({ order: [['name', 'ASC']] });
        const groupsJSON = await Promise.all(allGroups.map(async (group) => {
            const userCount = await UserGroup.count({
                where: {
                    groupName: group.name
                }
            });
            return {
                name: group.name,
                isMember: userGroupNames.includes(group.name),
                isFull: userCount === 20
            };
        }));
        
        res.json({ groups: groupsJSON });

    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Adding a group to the database and creating the relationship with the creator
router.post('/group/add', async (req, res) => {
    try {
        const { name,username } = req.body;

        const existingGroup = await Group.findOne({ where: { name:name } });
        if (existingGroup) {
            return res.status(400).json({ error: 'A group with the same name already exists.' });
        }

        const newGroup = await Group.create({
            name: name,
            creator: username,
            createdAt: new Date()
        });

        await UserGroup.create({
            username: username,
            groupName: name,
            enteredAt: new Date()
        });

        res.json(newGroup);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Getting a group by its name
router.get('/group/:name', async (req, res) => {
    try {
        const groupName = req.params.name;

        // Need also to get the group members
        const group = await Group.findOne({
            where: {
                name: groupName
            }
        });
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const userGroups = await UserGroup.findAll({
            where: {
              groupName: groupName
            }
        });

        // Construct JSON response
        const groupJSON = group.toJSON();
        groupJSON.users = userGroups.map(userGroup => userGroup.username);

        res.json(groupJSON);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});


// Adding a new relationship in the database between a group and a user when this one joins it
router.post('/group/:name/join', async (req, res) => {
    try {
        const groupName = req.params.name;
        const { username } = req.body;

        const userCount = await UserGroup.count({
            where: {
                groupName: groupName
            }
        });

        if (userCount >= 20) {
            return res.status(400).json({ error: 'Group is already full' });
        }

        const newUserGroup = await UserGroup.create({
            username: username,
            groupName: groupName,
            enteredAt: new Date()
        });

        res.json(newUserGroup);
    } catch (error) {
       return res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Route for edit the statics of a user
router.post('/statistics/edit', async (req, res) => {
    try {

        const { username, the_callenge_earned_money, the_callenge_correctly_answered_questions, the_callenge_incorrectly_answered_questions, 
            the_callenge_total_time_played, the_callenge_games_played } = req.body;

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
        statisticsUserToUpdate.the_callenge_earned_money = statisticsUserToUpdate.the_callenge_earned_money  + the_callenge_earned_money;
        statisticsUserToUpdate.the_callenge_correctly_answered_questions = statisticsUserToUpdate.the_callenge_correctly_answered_questions 
        + the_callenge_correctly_answered_questions;
        statisticsUserToUpdate.the_callenge_incorrectly_answered_questions = statisticsUserToUpdate.the_callenge_incorrectly_answered_questions 
        + the_callenge_incorrectly_answered_questions;
        statisticsUserToUpdate.the_callenge_total_time_played = statisticsUserToUpdate.the_callenge_total_time_played + the_callenge_total_time_played;
        statisticsUserToUpdate.the_callenge_games_played = statisticsUserToUpdate.the_callenge_games_played + the_callenge_games_played;

        // Save the changes to the database
        await statisticsUserToUpdate.save();

        res.json({ message: 'User statics updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

//Get user statics by username
router.get('/statistics/:username', async (req,res) => {
    try {
        
        const username = req.params.username;

        // Querying using sequelize findOne method
        const user = await Statistics.findOne({
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
router.get('/get/:username', async (req,res) => {
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

router.get('/ranking', async (req, res) => {
    try {
        const usersSortedByScore = await Statistics.findAll({
            attributes: [
                'username',
                [
                    sequelize.literal(`
                        the_callenge_correctly_answered_questions +
                        wise_men_stack_correctly_answered_questions +
                        warm_question_correctly_answered_questions +
                        discovering_cities_correctly_answered_questions
                    `),
                    'totalScore'
                ]
            ],
            order: [['totalScore', 'DESC']]
        });

        const resp = {rank: usersSortedByScore};
        res.json(resp);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;