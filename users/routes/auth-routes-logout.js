const express = require('express');
const router = express.Router();

require('dotenv').config();

router.post('/', async (req, res) => {
    try {

      req.session.username = null;
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });


module.exports = router;