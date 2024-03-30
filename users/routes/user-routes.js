const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, Statistics } = require('../services/user-model');

//User internal routes
const apiRoutes = require('../routes/user-routes-api');

// Route for add a user
router.post('/add', async (req, res) => {
    try {
        console.log(1);
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
            createdAt: new Date(),
            updatedAt: new Date(),
            name,
            surname
        });

        // Create the user statics
        await Statistics.create({
            username,
        })

        res.json(newUser);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            // validation errors
            const validationErrors = error.errors.map(err => err.message);
            res.status(400).json({ error: 'Error de validación', details: validationErrors });
        } else {
            // Other errors
            res.status(400).json({ error: error.message });
        }
    }
});


router.post('/logout', async (req, res) => {
    try {

      req.session.username = null;
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });


router.get('/session', async (req, res) => {
    res.json({ session: req.session });
});

//Api middleware
router.use('/api', apiRoutes);


module.exports = router;