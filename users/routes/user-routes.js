const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, Statistics, Group, UserGroup, QuestionsRecord, sequelize } = require('../services/user-model');
const { getRandomPic } = require("../data/icons");

// Getting the list of groups in the database
router.get('/group', async (req, res) => {
    try {

        const username = req.query.username;

        // If the user is null or undefined (no one is logged, return all groups)
        if (username === null || username === undefined) {
            const allGroups = await Group.findAll({ order: [['name', 'ASC']] });
            const groupsJSON = await Promise.all(allGroups.map(async (group) => {
                return {
                    name: group.name,
                    isMember: false
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
                isCreator: group.creator === username,
                isFull: userCount === 20
            };
        }));
        res.json({ groups: groupsJSON });

    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/profile', async (req, res) => {
    try {
        const username = req.query.username;

        // Querying using sequelize findOne method
        const user = await User.findOne({
            where: {
                username: username
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'No user found' });
        }

        res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/profile/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const { imageUrl } = req.body;

        //Update the user's fields with the provided values
        const [affectedRows] = await User.update({ imageUrl }, { where: { username } });
        if (affectedRows === 0) {
            return res.status(404).json({ error: 'No user could be updated' });
        }

        res.status(200).json({ affectedRows });  
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route for getting the statistics of a user
router.get('/ranking', async (req, res) => {
    try {
        const usersStatistics = await Statistics.findAll({
            attributes: [
                [
                    sequelize.literal(`
                        username
                    `),
                    'id'
                ],
                [
                    sequelize.literal(`
                        the_callenge_earned_money +
                        wise_men_stack_earned_money +
                        warm_question_earned_money +
                        discovering_cities_earned_money +
                        online_earned_money
                    `),
                    'totalMoney'
                ],
                [
                    sequelize.literal(`
                        the_callenge_correctly_answered_questions +
                        wise_men_stack_correctly_answered_questions +
                        warm_question_correctly_answered_questions +
                        discovering_cities_correctly_answered_questions +
                        online_correctly_answered_questions
                    `),
                    'totalCorrectAnswers'
                ],
                [
                    sequelize.literal(`
                        the_callenge_incorrectly_answered_questions +
                        wise_men_stack_incorrectly_answered_questions +
                        warm_question_incorrectly_answered_questions +
                        discovering_cities_incorrectly_answered_questions +
                        online_incorrectly_answered_questions
                    `),
                    'totalIncorrectAnswers'
                ],
                [
                    sequelize.literal(`
                        the_callenge_games_played +
                        wise_men_stack_games_played +
                        warm_question_games_played +
                        discovering_cities_games_played +
                        online_games_played
                    `),
                    'totalGamesPlayed'
                ]
            ],
            order: [['totalMoney', 'DESC']]
        });
        res.json({ rank: usersStatistics });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//Get user by username
router.get('/:username', async (req,res) => {
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
//Get all users
router.get('/', async (req,res) => {

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
        const record = await QuestionsRecord.findAll({
            where: {
                username: username,
                gameMode: gameMode
            }
        });
        /*
        if (record.length == 0) {
            return res.status(404).json({ error: 'No record found' });
        }*/

        res.json(record);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
// Route to add a user
router.post('/', async (req, res) => {
    try {
        const { username, password, name, surname } = req.body;

        const user = await User.findOne({ where: { username } });

        if (user != null) {
            throw new Error('Invalid username');
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

        const imageUrl = getRandomPic();

        // Create the user in the database using Sequelize
        const newUser = await User.create({
            username,
            password: hashedPassword,
            name,
            surname,
            imageUrl
        });

        // Create the user statistics
        await Statistics.create({
            username
        })

        res.json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Adding a group to the database and creating the relationship with the creator
router.post('/group', async (req, res) => {
    try {
        const { name,username } = req.body;

        if (name.trim().length < 4) {
            return res.status(400).json({ error: 'Group name must be at least 4 characters long.' });
        }

        const groupsCreatedByUser = await Group.findAndCountAll({ where: { creator:username } });
        if (groupsCreatedByUser.count >= 3) {
            return res.status(400).json({ error: 'You cannot create more than three groups' });
        }

        const existingGroup = await Group.findOne({ where: { name:name } });
        if (existingGroup) {
            return res.status(400).json({ error: 'A group with the same name already exists' });
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
router.get('/group/ranking', async (req, res) => {
    try {
        const groups = await Group.findAll({ attributes: ['name'] });

        const groupStatistics = [];

        for (const group of groups) {
            const userGroups = await UserGroup.findAll({
                where: { groupName: group.name }
            });

            let totalMoney = 0;
            let totalCorrectAnswers = 0;
            let totalIncorrectAnswers = 0;
            let totalGamesPlayed = 0;

            for (const username of userGroups.map(userGroup => userGroup.username)) {

                const userStatistics = await Statistics.findOne({
                    where: { username }
                });

                if (userStatistics) {
                    totalMoney += userStatistics.the_callenge_earned_money +
                                  userStatistics.wise_men_stack_earned_money +
                                  userStatistics.warm_question_earned_money +
                                  userStatistics.discovering_cities_earned_money +
                                  userStatistics.online_earned_money;

                    totalCorrectAnswers += userStatistics.the_callenge_correctly_answered_questions +
                                           userStatistics.wise_men_stack_correctly_answered_questions +
                                           userStatistics.warm_question_correctly_answered_questions +
                                           userStatistics.discovering_cities_correctly_answered_questions +
                                           userStatistics.online_correctly_answered_questions;

                    totalIncorrectAnswers += userStatistics.the_callenge_incorrectly_answered_questions +
                                             userStatistics.wise_men_stack_incorrectly_answered_questions +
                                             userStatistics.warm_question_incorrectly_answered_questions +
                                             userStatistics.discovering_cities_incorrectly_answered_questions +
                                             userStatistics.online_incorrectly_answered_questions;

                    totalGamesPlayed += userStatistics.the_callenge_games_played +
                                       userStatistics.wise_men_stack_games_played +
                                       userStatistics.warm_question_games_played +
                                       userStatistics.discovering_cities_games_played +
                                       userStatistics.online_games_played;
                }
            }

            groupStatistics.push({
                id:group.name,
                totalMoney,
                totalCorrectAnswers,
                totalIncorrectAnswers,
                totalGamesPlayed
            });
        }

        groupStatistics.sort((a, b) => b.totalMoney - a.totalMoney);
        res.json({ rank: groupStatistics });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Getting a group by its name
router.get('/group/:name', async (req, res) => {
    try {
        const groupName = req.params.name;
        const username = req.query.username;

        const userBelongsToGroup = await UserGroup.findOne({
            where: {
                groupName: groupName,
                username: username
            }
        });

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
        groupJSON.show = !!userBelongsToGroup;

        res.json(groupJSON);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
// Adding a new relationship in the database between a group and a user when this one joins it
router.post('/group/:name', async (req, res) => {
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
//leave a group
router.post('/group/:name/exit', async (req, res) => {
    try {
        const groupName = req.params.name;
        const { username } = req.body;

        if (username === null || username === undefined) {
            return res.status(400).json({ error: 'Need to be logged in an in a group to leave it.' });
        }

        const userGroup = await UserGroup.findOne({
            where: {
                username: username,
                groupName: groupName
            }
        });

        const groupInfo = await Group.findOne({
            where: {
                name: groupName
            }
        });

        if (!userGroup || !groupInfo) {
            return res.status(400).json({ error: 'Need to be logged in an in a group to leave it.' });
        }

        if (groupInfo.creator !== username) {
            await UserGroup.destroy({
                where: {
                    username: username,
                    groupName: groupName
                }
            });
        } else {
            await UserGroup.destroy({
                where: {
                    groupName: groupName
                }
            });
            await Group.destroy({
                where: {
                    name: groupName,
                    creator: username
                }
            });
        }
        res.sendStatus(200);
    } catch (error) {
       return res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Route for edit the statics of a user
router.post('/statistics', async (req, res) => {
    try {

        const { username, the_callenge_earned_money, the_callenge_correctly_answered_questions, the_callenge_incorrectly_answered_questions, 
            the_callenge_total_time_played, the_callenge_games_played, wise_men_stack_earned_money, wise_men_stack_correctly_answered_questions, 
            wise_men_stack_incorrectly_answered_questions, wise_men_stack_games_played, warm_question_earned_money, warm_question_correctly_answered_questions,
            warm_question_incorrectly_answered_questions, warm_question_passed_questions, warm_question_games_played, discovering_cities_earned_money, 
            discovering_cities_correctly_answered_questions, discovering_cities_incorrectly_answered_questions, discovering_cities_games_played, online_earned_money,
            online_correctly_answered_questions, online_incorrectly_answered_questions, online_total_time_played, online_games_played} = req.body;

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
        statisticsUserToUpdate.the_callenge_earned_money += the_callenge_earned_money;
        statisticsUserToUpdate.the_callenge_correctly_answered_questions += the_callenge_correctly_answered_questions;
        statisticsUserToUpdate.the_callenge_incorrectly_answered_questions += the_callenge_incorrectly_answered_questions;
        statisticsUserToUpdate.the_callenge_total_time_played += the_callenge_total_time_played;
        statisticsUserToUpdate.the_callenge_games_played += the_callenge_games_played;

        statisticsUserToUpdate.wise_men_stack_earned_money += wise_men_stack_earned_money;
        statisticsUserToUpdate.wise_men_stack_correctly_answered_questions += wise_men_stack_correctly_answered_questions;
        statisticsUserToUpdate.wise_men_stack_incorrectly_answered_questions += wise_men_stack_incorrectly_answered_questions;
        statisticsUserToUpdate.wise_men_stack_games_played += wise_men_stack_games_played;

        statisticsUserToUpdate.warm_question_earned_money += warm_question_earned_money;
        statisticsUserToUpdate.warm_question_correctly_answered_questions += warm_question_correctly_answered_questions;
        statisticsUserToUpdate.warm_question_incorrectly_answered_questions += warm_question_incorrectly_answered_questions;
        statisticsUserToUpdate.warm_question_passed_questions += warm_question_passed_questions;
        statisticsUserToUpdate.warm_question_games_played += warm_question_games_played;

        statisticsUserToUpdate.discovering_cities_earned_money += discovering_cities_earned_money;
        statisticsUserToUpdate.discovering_cities_correctly_answered_questions += discovering_cities_correctly_answered_questions;
        statisticsUserToUpdate.discovering_cities_incorrectly_answered_questions += discovering_cities_incorrectly_answered_questions;
        statisticsUserToUpdate.discovering_cities_games_played += discovering_cities_games_played;

        statisticsUserToUpdate.online_earned_money += online_earned_money;
        statisticsUserToUpdate.online_correctly_answered_questions += online_correctly_answered_questions;
        statisticsUserToUpdate.online_incorrectly_answered_questions += online_incorrectly_answered_questions;
        statisticsUserToUpdate.online_total_time_played += online_total_time_played;
        statisticsUserToUpdate.online_games_played += online_games_played;

        // Save the changes to the database
        await statisticsUserToUpdate.save();
        res.status(200);
        res.json({ message: 'User statics updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});
//Get user statics by username
router.get('/statistics/:username', async (req,res) => {
    try {
        
        const username = req.params.username;
        const loggedUser = req.query.loggedUser;

        if(loggedUser === null || loggedUser === undefined){
            return res.status(403).json({ error: 'You must be logged to see a user statistics' });
        }else if(username !== loggedUser){
            const userGroups = await UserGroup.findAll({
                where: {
                  username: username
                }
            });
    
            const loggedUserGroups = await UserGroup.findAll({
                where: {
                  username: loggedUser
                }
            });
    
            if (loggedUserGroups.length != 0 && userGroups != 0){
                const hasCommonGroup = userGroups.some(userGroup => {
                    return loggedUserGroups.some(loggedUserGroup => loggedUserGroup.groupName === userGroup.groupName);
                });
    
                if(!hasCommonGroup){
                    return res.status(403).json({ error: 'You are not allowed to see this user statistics' });
                }
            }
        }

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


module.exports = router;