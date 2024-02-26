const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./auth-model');

const app = express();
const port = 8002; 

// Middleware to parse JSON in request body
app.use(express.json());

// Route for user login
app.post('/login', async (req, res) => {
  try {

    const { username, password } = req.body;

    // Check if required fields are present in the request body
    if (!username || !password) {
      throw new Error('Missing required fields');
    }

    // Find the user by username in the database
    const user = await User.findOne({ username });
    // const user = await User.findOne({ where: { username } });

    // Check if the user exists and verify the password
    if (user && await bcrypt.compare(password, user.password)) {
      // Generate a JWT token
      const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });
      // Respond with the token and user information
      return res.json({ token, username, createdAt: user.createdAt });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Auth Service listening at http://localhost:${port}`);
});

module.exports = server
