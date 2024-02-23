// user-service.js
const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const UserPool = require('./user-model');

const app = express();
const port = 8001;

// Middleware to parse JSON in request body
app.use(bodyParser.json());

// Use the existing MariaDB connection pool from user-model.js
const pool = UserPool;

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
  for (const field of requiredFields) {
    if (!(field in req.body)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

app.post('/adduser', async (req, res) => {
  try {
    
    validateRequiredFields(req, ['username', 'password']);

    // Encrypt the password before saving it
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Insert new user into the MariaDB database using the existing pool
    const [rows] = await pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [req.body.username, hashedPassword]);

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

const server = app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

module.exports = server;