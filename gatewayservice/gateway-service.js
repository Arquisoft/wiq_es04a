const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle');
const { URL } = require('url'); 

const app = express();
const port = 8000;

const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';
const questionGenerationServiceUrl = process.env.QUESTION_SERVICE_URL || 'http://localhost:8010';

app.use(cors());
app.use(express.json());

// Prometheus configuration
const metricsMiddleware = promBundle({ includeMethod: true });
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

app.get('/ranking', async (req, res) => {
  try {
    const rankingURL = new URL('/user/ranking', userServiceUrl);
    const response = await axios.get(rankingURL);
    res.json(response.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.get('/profile', async (req, res) => {
  try {
    const username = req.query.username;
    const profileURL = new URL('/user/profile', userServiceUrl);
    const response = await axios.get(profileURL, { params: { username: username } });
    res.json(response.data.user);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.put('/profile/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const urlPath = `/user/profile/${encodeURIComponent(username)}`;
    const userProfileUrl = new URL(urlPath, userServiceUrl);
    const response = await axios.post(userProfileUrl, req.body);
    res.json(response.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.post('/login', async (req, res) => {
  try {
    const authUrl = new URL('/login', userServiceUrl);
    const authResponse = await axios.post(authUrl.toString(), req.body);
    res.json(authResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.get('/questionsRecord/:username/:gameMode', async (req, res) => {
  try {
    const { username, gameMode } = req.params;
    const urlPath = `/user/questionsRecord/${encodeURIComponent(username)}/${encodeURIComponent(gameMode)}`;
    const userRecordUrl = new URL(urlPath, userServiceUrl);
    const userResponse = await axios.get(userRecordUrl.toString(), req.body);
    res.json(userResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.put('/questionsRecord', async (req, res) => {
  try {
    const response = await axios.post(`${userServiceUrl}/user/questionsRecord`, req.body);
    res.json(response.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.get('/user/group', async (req, res) => {
  try {
    const username = req.query.username;
    const userResponse = await axios.get(new URL('/user/group', userServiceUrl), { params: { username: username } });
    res.json(userResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.get('/user', async (req, res) => {
  try {
    const usersUrl = new URL('/user', userServiceUrl);
    const response = await axios.get(usersUrl);
    res.json(response.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.get('/user/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const userResponse = await axios.get(new URL(`/user/get/${username}`, userServiceUrl), req.body);
    res.json(userResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.post('/user', async (req, res) => {
  try {
    const userResponse = await axios.post(`${userServiceUrl}/user/add`, req.body);
    res.json(userResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.get('/questions/:lang', async (req, res) => {
  try {
    const language = encodeURIComponent(req.params.lang);
    const questionsResponse = await axios.get(new URL(`/questions/${language}`, questionGenerationServiceUrl));
    res.json(questionsResponse.data);
  } catch (error) {
    res.status(error.response).json({ error: error.response });
  }
});

app.get('/questions/:lang/:category', async (req, res) => {
  try {
    const category = encodeURIComponent(req.params.category);
    const language = encodeURIComponent(req.params.lang);
    const questionsResponse = await axios.get(new URL(`/questions/getQuestionsFromDb/1/${category}/${language}`, questionGenerationServiceUrl));
    res.json(questionsResponse.data);
  } catch (error) {
    res.status(error.response).json({ error: error.response });
  }
});

app.put('/statistics', async (req, res) => {
  try {
    const userResponse = await axios.post(`${userServiceUrl}/user/statistics/edit`, req.body);
    res.json(userResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.get('/statistics/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const loggedUser = req.query.loggedUser;
    const userResponse = await axios.get(new URL(`/user/statistics/${username}`, userServiceUrl), { params: { loggedUser: loggedUser } });
    res.json(userResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.get('/group', async (req, res) => {
  try {
    const username = req.query.username;
    const userResponse = await axios.get(new URL('/user/group/list', userServiceUrl), { params: { username: username } });
    res.json(userResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.post('/group', async (req, res) => {
  try {
    const userResponse = await axios.post(`${userServiceUrl}/user/group`, req.body);
    res.json(userResponse.data);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      res.status(400).json({ error: error.response.data.error });
    } else {
      handleErrors(res, error);
    }
  }
});

app.get('/group/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const username = req.query.username;
    const userResponse = await axios.get(new URL(`/user/group/${name}`, userServiceUrl), { params: { username: username } });
    res.json(userResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.post('/group/:name/join', async (req, res) => {
  try {
    const { name } = req.params;
    const userResponse = await axios.post(new URL(`/user/group/${name}/join`, userServiceUrl), req.body);
    res.json(userResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.post('/group/:name/exit', async (req, res) => {
  try {
    const { name } = req.params;
    const userResponse = await axios.post(new URL(`/user/group/${name}/exit`, userServiceUrl), req.body);
    res.json(userResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server;
