const express = require('express');
const router = express.Router();
const { Group,UserGroup } = require('../models/user-model');

//Group internal routes
const apiRoutes = require('../services/group-api');

// Adding a group to the database and creating the relationship with the creator
router.post('/add', async (req, res) => {
    try {
        const { name,username } = req.body;

        const existingGroup = await Group.findOne({ name: name });
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

// Adding a new relationship in the database between a group and a user when this one joins it
router.post('/:name/join', async (req, res) => {
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


//Api middleware
router.use('/api', apiRoutes);

module.exports = router;