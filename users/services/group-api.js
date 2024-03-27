const express = require('express');
const router = express.Router();
const { Group,User,UserGroup } = require('../models/user-model');


// Getting the list of groups in the database
router.get('/list', async (req, res) => {
    try {

        const username = req.query.username;

        // If the user is null or undefined (no one is logged, return all groups)
        if (username===null || username===undefined) {
            const allGroups = await Group.findAll();
            const groupsJSON = allGroups.map(group => {
              return {
                name: group.name,
                isMember: false
              };
            });
            return res.json({ groups: groupsJSON });
        }

        // If someone is logged, return the groups indicating which one the user has joined
        const userGroups = await UserGroup.findAll({
            where: {
              username: username
            }
        });
        const userGroupNames = userGroups.map(userGroup => userGroup.groupName);

        const allGroups = await Group.findAll();
        const groupsJSON = allGroups.map(group => {
            return {
              name: group.name,
              isMember: userGroupNames.includes(group.name)
            };
        });

        res.json({ groups: groupsJSON });

    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Getting a group by its name
router.get('/:name', async (req, res) => {
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


module.exports = router;