const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./auth-model')

const app = express();
const port = 8002; 

// Middleware to parse JSON in request body
app.use(express.json());

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
    for (const field of requiredFields) {
      if (!(field in req.body)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
}

// Route for user login
app.post('/login', async (req, res) => {
  try {
    // Check if required fields are present in the request body
    validateRequiredFields(req, ['username', 'password']);

    const { username, password } = req.body;

    // Get a connection from the pool
    const conn = await pool.getConnection();

    try {
      // Query the database to find the user by username
      const [rows] = await conn.query('SELECT * FROM users WHERE username = ?', [username]);

      if (rows.length > 0 && await bcrypt.compare(password, rows[0].password)) {
        const token = jwt.sign({ userId: rows[0].id }, 'your-secret-key', { expiresIn: '1h' });
        res.json({ token: token, username: username, createdAt: rows[0].createdAt });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } finally {
      // Release the connection back to the pool
      conn.release();
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Auth Service listening at http://localhost:${port}`);
});

server.on('close', () => {
    // Close the MariaDB connection pool
  pool.end();
  });

module.exports = server
