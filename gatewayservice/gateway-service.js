const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');

const app = express();
const port = 8000;

const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://authservice:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://userservice:8001';

app.use(cors());
app.use(express.json());

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'OK' });
});

app.post('/login', async (req, res) => {
  try {
    // Forward the login request to the authentication service
    const authResponse = await axios.post(authServiceUrl+'/login', req.body);
    res.json(authResponse.data);
  } catch (error) {
    // console.log(error + " hola");
    if (error.response && error.response.status) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else if (error.message) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.post('/adduser', async (req, res) => {
  try {
    // Forward the add user request to the user service
    const userResponse = await axios.post(userServiceUrl + '/adduser', req.body);
    res.json(userResponse.data);
  } catch (error) {
    if (error.response && error.response.status) {
      res.status(error.response.status).json({ error: error.response.data.error });
    } else if (error.message) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server
