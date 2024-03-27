const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');

const app = express();
const port = 8000;

const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';

const questionGenerationServiceUrl = process.env.QUESTION_SERVICE_URL || 'http://localhost:8010';

app.use(cors());
app.use(express.json());

//Prometheus configuration
const metricsMiddleware = promBundle({includeMethod: true});
app.use(metricsMiddleware);

const handleErrors = (res, error) => {
  if (error.response && error.response.status) {
    res.status(error.response.status).json({ error: error.response.data.error });
  } else if (error.message) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'OK' });
});

app.post('/login', async (req, res) => {
  try {
    // Forward the login request to the authentication service
    const authResponse = await axios.post(userServiceUrl+'/login', req.body);
    res.json(authResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.post('/user/add', async (req, res) => {
  try {
    // Forward the add user request to the user service
    const userResponse = await axios.post(userServiceUrl + '/user/add', req.body);
    res.json(userResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.get('/questions', async (req, res) => {
  try {
    const questionsResponse = await axios.get(`${questionGenerationServiceUrl}/questions`);
    res.json(questionsResponse.data);
  } catch (error) {
    res.status(error.response).json({ error: error.response });
  }
});

app.post('/statics/edit', async (req, res) => {
  try {
    // Forward the user statics edit request to the user service
    const userResponse = await axios.post(userServiceUrl + '/statics/edit', req.body);
    res.json(userResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.get('/group/list', async (req, res) => {
  try {

    const username = req.query.username;
    const userResponse = await axios.get(userServiceUrl + '/group/api/list',{params: {username: username }});
    res.json(userResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});


app.post('/group/add', async (req, res) => {
  try {
    const userResponse = await axios.post(userServiceUrl + '/group/add', req.body);
    res.json(userResponse.data);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      res.status(400).json({ error: error.response.data.error });
    }else{
      handleErrors(res, error);
    }
  }
});

app.get('/group/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const userResponse = await axios.get(`${userServiceUrl}/group/${name}`);
    res.json(userResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.post('/group/:name/join', async (req, res) => {
  try {
    const { name } = req.params;
    const userResponse = await axios.post(`${userServiceUrl}/group/${name}/join`, req.body);
    res.json(userResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server
