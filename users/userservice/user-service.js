const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const { User } = require('./user-model');

const app = express();
const port = 8001;

app.use(bodyParser.json());

app.post('/adduser', async (req, res) => {
    try {
        const { username, password, name, surname, imageUrl,} = req.body;

        // Validate required fields
        if (!username || !password || !name || !surname || !imageUrl) {
            throw new Error('Missing required fields');
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
            surname,
            imageURL,
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