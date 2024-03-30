const express = require('express');
const router = express.Router();
const { Group,User,UserGroup } = require('../models/user-model');


// Getting the list of groups in the database
router.get('/list', async (req, res) => {
    try {
        const allGroups = await Group.findAll();
        const groupsJSON = allGroups.map(group => group.toJSON());

        const allGroupsJSON = {
            groups: groupsJSON
        };

        res.json(allGroupsJSON);
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
        
        const groupUsers = await User.findAll({
            include: [
                {
                    model: UserGroup,
                    where: { name: groupName }
                }
            ]
        });

        // Construct JSON response
        const groupJSON = group.toJSON();
        groupJSON.users = groupUsers.map(user => user.toJSON());

        res.json(groupJSON);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
});


module.exports = router;