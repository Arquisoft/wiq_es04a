// user-service.js
const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const { createUsersTable } = require('./user-model');



const app = express();
const port = 8001;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
    for (const field of requiredFields) {
        if (!(field in req.body)) {
            throw new Error(`Missing required field: ${field}`);
        }
    }
}

// Function to create a database connection
async function connectToDatabase() {
    try {
        const connection = await createUsersTable();
        return connection;
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        throw error;
    }
}

app.post('/adduser', async (req, res) => {
    try {
        validateRequiredFields(req, ['username', 'password']);

        // Encrypt the password before saving it
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Ensure that the users table is created before attempting to insert data
        const connection = await connectToDatabase();

        // Insert new user into the MariaDB database using the existing connection
        const [rows] = await connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [req.body.username, hashedPassword]);

        const newUser = {
            id: rows.insertId,
            username: req.body.username,
            password: hashedPassword,
        };

        res.json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Ensure that the users table is created when the application starts
createUsersTable();

const server = app.listen(port, () => {
    console.log(`User Service listening at http://localhost:${port}`);
});

module.exports = server;