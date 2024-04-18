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
//It uses prometheus middleware whenever a petition happens
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


app.get('/user/profile', async (req, res) => {
  try {
    const username = req.query.username;
    const response = await axios.get(`${userServiceUrl}/user/profile`, {params: {username: username }});
    res.json(response.data.user);
  } catch (error) {
    handleErrors(res, error);
}});

app.post('/user/profile/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const response = await axios.post(`${userServiceUrl}/user/profile/`+username, req.body);
    res.json(response.data);
  } catch (error) {
    handleErrors(res, error);
}});

app.post('/login', async (req, res) => {
  try {
    // Forward the login request to the authentication service
    const authResponse = await axios.post(`${userServiceUrl}/login`, req.body);
    res.json(authResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.get('/user/questionsRecord/:username/:gameMode', async (req, res) => {
  try {
    console.log(1)
    const username = req.params.username;
    const gameMode = req.params.gameMode;
    // Forward the user statics edit request to the user service
    const userResponse = await axios.get(`${userServiceUrl}/user/questionsRecord/${username}/${gameMode}`, req.body);
    res.json(userResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.post('/user/questionsRecord', async (req, res) => {
  try {
    const response = await axios.post(userServiceUrl+`/user/questionsRecord`, req.body);
    res.json(response.data); 
  } catch (error) {
    console.error("Error al actualizar el historial de preguntas:", error);
    res.status(500).json({ error: "Error al actualizar el historial de preguntas" });
  }
});

app.get('/user/allUsers', async (req, res) => {
  try {
    const response = await axios.get(`${userServiceUrl}/user/allUsers`);
    res.json(response.data); // Send just the response data
  } catch (error) {
    console.error("Error al obtener la sesión del usuario:", error);
    res.status(500).json({ error: "Error al obtener la sesión del usuario" });
  }
});

app.get('/user/ranking', async (req, res) => {
  try {
    const response = await axios.get(`${userServiceUrl}/user/ranking`);
    res.json(response.data); // Send just the response data
  } catch (error) {
    console.error("Error al obtener la sesión del usuario:", error);
    res.status(500).json({ error: "Error al obtener la sesión del usuario" });
  }
});

app.get('/user/get/:username', async (req, res) => {
  try {
    const username = req.params.username;
    // Forward the user statics edit request to the user service
    const userResponse = await axios.get(userServiceUrl+'/user/get/'+username, req.body);
    res.json(userResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.post('/user/add', async (req, res) => {
  try {
    // Forward the add user request to the user service
    const userResponse = await axios.post(`${userServiceUrl}/user/add`, req.body);
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

app.get('/questions/:category', async (req, res) => {
  try {
    const category = encodeURIComponent(req.params.category);
    const questionsResponse = await axios.get(`${questionGenerationServiceUrl}/questions/getQuestionsFromDb/1/${category}`);
    res.json(questionsResponse.data);
  } catch (error) {
    res.status(error.response).json({ error: error.response });
  }
});


app.post('/statistics/edit', async (req, res) => {
  try {
    // Forward the user statics edit request to the user service
    const userResponse = await axios.post(`${userServiceUrl}/user/statistics/edit`, req.body);
    res.json(userResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.get('/user/statistics/:username', async (req, res) => {
  try {
    const username = req.params.username;
    const loggedUser = req.query.loggedUser;
    // Forward the user statics edit request to the user service
    const userResponse = await axios.get(`${userServiceUrl}/user/statistics/${username}`,{params: {loggedUser: loggedUser }});
    res.json(userResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.get('/user/group/list', async (req, res) => {
  try {
    const username = req.query.username;
    const userResponse = await axios.get(userServiceUrl + '/user/group/list',{params: {username: username }});
    res.json(userResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.get('/user/group/ranking', async (req, res) => {
  try {
    const groupResponse = await axios.get(`${userServiceUrl}/user/group/ranking`);
    res.json(groupResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.post('/group/add', async (req, res) => {
  try {
    const userResponse = await axios.post(`${userServiceUrl}/user/group/add`, req.body);
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
    const username = req.query.username;
    const userResponse = await axios.get(`${userServiceUrl}/user/group/${name}`,{params: {username: username }});
    res.json(userResponse.data);
  } catch (error) {
    handleErrors(res, error);
  }
});

app.post('/group/:name/join', async (req, res) => {
  try {
    const { name } = req.params;
    const userResponse = await axios.post(`${userServiceUrl}/user/group/${name}/join`, req.body);
    res.json(userResponse.data);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      res.status(400).json({ error: error.response.data.error });
    }else{
      handleErrors(res, error);
    }
  }
});

app.post('/group/:name/exit', async (req, res) => {
  try {
    const { name } = req.params;
    const userResponse = await axios.post(`${userServiceUrl}/user/group/${name}/exit`, req.body);
    res.json(userResponse.data);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      res.status(400).json({ error: error.response.data.error });
    }else{
      handleErrors(res, error);
    }
  }
});

// Start the gateway service
const server = app.listen(port, () => {
  console.log(`Gateway Service listening at http://localhost:${port}`);
});

module.exports = server
