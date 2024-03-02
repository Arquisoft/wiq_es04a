const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user-model');

router.post('/', async (req, res) => {
    try {
  
      const { username, password } = req.body;
  
      // Check if required fields are present in the request body
      if (!username || !password) {
        throw new Error('Missing required fields');
      }
  
      // Find the user by username in the database
      // const user = await User.findOne({ username });
      const user = await User.findOne({ where: { username } });
  
      // Check if the user exists and verify the password
      if (user && user.username === username && await bcrypt.compare(password, user.password)) {
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


module.exports = router;