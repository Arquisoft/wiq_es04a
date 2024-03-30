const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Group,User,UserGroup } = require('../models/user-model');

//Group internal routes
const apiRoutes = require('../services/group-api');

// Adding a group to the database
router.post('/add', async (req, res) => {
    try {
        const { name,username } = req.body;

        const newGroup = await Group.create({
            name: name,
            creator: username,
            createdAt: new Date()
        });

        res.json(newGroup);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Adding a new relationship in the database between a group and a user when this one joins it
router.post('/:name/join', async (req, res) => {
    try {
        const groupName = req.params.name;
        const { username } = req.body;

        // Need to be tested
        const newUserGroup = await UserGroup.create({
            name: groupName,
            username: username,
            createdAt: new Date()
        });

        res.json(newUserGroup);
    } catch (error) {
       return res.status(500).json({ error: 'Internal Server Error' });
    }
});


//Api middleware
router.use('/api', apiRoutes);

module.exports = router;