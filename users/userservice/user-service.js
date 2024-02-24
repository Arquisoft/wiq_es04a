const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const { User } = require('./user-model');

const app = express();
const port = 8001;

app.use(bodyParser.json());

app.post('/adduser', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate required fields
        if (!username || !password) {
            throw new Error('Missing required fields: username and password');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database using Sequelize
        const newUser = await User.create({
            username,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        res.json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const server = app.listen(port, () => {
    console.log(`User Service listening at http://localhost:${port}`);
});

module.exports = server;