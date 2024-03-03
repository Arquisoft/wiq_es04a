const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user-model');


require('dotenv').config();

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
        
        // Token payload
        const payload = {
          userId: username,
          password: password
        };

        //CHANGE THIS TO ENVIRONMENT VARS (NOT PUBLIC)
        const secretKey = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwOTQ2OTkzMywiaWF0IjoxNzA5NDY5OTMzfQ.pQ8H6FKeZyEHPnGs4Ah3-n-QXJ5E8YM_u1AfZHI7Ip0';

        const options = {
          expiresIn: '1h'
        };

        //Token sign and creation
        const token = jwt.sign(payload, secretKey, options);

        // Respond with the token and user information
        return res.json({ authToken: token, username, createdAt: user.createdAt });

      } else {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });


module.exports = router;