const express = require('express');
const router = express.Router();
const { Statics } = require('../models/user-model');

//Get user statics by username
router.get('/:username', async (req,res) => {
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


module.exports = router;