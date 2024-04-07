const axios = require('axios');
const request = require('supertest');
const app = require('../gateway-service.js');

jest.mock('axios');

describe('Routes Tests', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  setTimeout(() => {
    process.exit(0); 
  }, 5000); 

  it('should respond with status 200 for /user/questionsRecord/:username/:gameMode endpoint', async () => {
    const mockUsername = 'testuser';
    const mockGameMode = 'testMode';
    const mockUserData = { username: mockUsername, gameMode: mockGameMode, questions: ['question1', 'question2'] };

    axios.get.mockResolvedValueOnce({ data: mockUserData });

    const response = await request(app)
      .get(`/user/questionsRecord/${mockUsername}/${mockGameMode}`);

    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining(`/user/questionsRecord/${mockUsername}/${mockGameMode}`), {}
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUserData);
});

  it('should respond with status 200 for /user/questionsRecord endpoint', async () => {
    const mockRequestData = { userId: 'testuser', questions: ['question1', 'question2'] };
    const mockResponseData = { success: true };

    axios.post.mockResolvedValueOnce({ data: mockResponseData });

    const response = await request(app)
      .post('/user/questionsRecord')
      .send(mockRequestData);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/user/questionsRecord'),
      mockRequestData
    );
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponseData);
  });

  it('should handle /user/questionsRecord errors and respond with appropriate status and message', async () => {
    const mockRequestData = { userId: 'testuser', questions: ['question1', 'question2'] };
    const errorMessage = 'Error updating questions record';
    axios.post.mockRejectedValueOnce(new Error(errorMessage));

    const response = await request(app)
      .post('/user/questionsRecord')
      .send(mockRequestData);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/user/questionsRecord'),
      mockRequestData
    );
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error al actualizar el historial de preguntas');
  });

  it('should respond with status 200 for /health endpoint', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  })

  it('should respond with status 200 for /login endpoint', async () => {
    const mockUserData = { username: 'testuser', token: 'mocktoken' };
    axios.post.mockResolvedValueOnce({ data: mockUserData });

    const response = await request(app).post('/login').send({ username: 'testuser', password: 'testpassword' });

    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/login'), { username: 'testuser', password: 'testpassword' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUserData);
  });

  it('should handle /login errors and respond with appropriate status and message', async () => {
    const errorMessage = 'Login failed';
    axios.post.mockRejectedValueOnce({ response: { status: 401, data: { error: errorMessage } } });

    const response = await request(app).post('/login').send({ username: 'testuser', password: 'testpassword' });

    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/login'), { username: 'testuser', password: 'testpassword' });
    expect(response.status).toBe(401);
    expect(response.body.error).toBe(errorMessage);
  });

  it('should respond with status 200 for /user/session endpoint', async () => {
    const mockSessionData = { username: 'testuser', role: 'user' };
    axios.get.mockResolvedValueOnce({ data: mockSessionData });

    const response = await request(app).get('/user/session');

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/user/session'));
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockSessionData);
  });

  it('should handle /user/session errors and respond with appropriate status and message', async () => {
    const errorMessage = 'Error fetching session data';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    const response = await request(app).get('/user/session');

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/user/session'));
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error al obtener la sesión del usuario');
  });

  it('should respond with status 200 for /user/allUsers endpoint', async () => {
    const mockUserData = [{ username: 'user1' }, { username: 'user2' }];
    axios.get.mockResolvedValueOnce({ data: mockUserData });

    const response = await request(app).get('/user/allUsers');

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/user/allUsers'));
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUserData);
  });

  it('should handle /user/allUsers errors and respond with appropriate status and message', async () => {
    const errorMessage = 'Error fetching user data';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    const response = await request(app).get('/user/allUsers');

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/user/allUsers'));
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error al obtener la sesión del usuario');
  });

  it('should respond with status 200 for /user/ranking endpoint', async () => {
    const mockRankingData = [{ username: 'user1', score: 100 }, { username: 'user2', score: 90 }];
    axios.get.mockResolvedValueOnce({ data: mockRankingData });

    const response = await request(app).get('/user/ranking');

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/user/ranking'));
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockRankingData);
  });

  it('should handle /user/ranking errors and respond with appropriate status and message', async () => {
    const errorMessage = 'Error fetching ranking data';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    const response = await request(app).get('/user/ranking');

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/user/ranking'));
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error al obtener la sesión del usuario');
  });

  it('sshould respond with status 200 for /user/get/${username} endpoint', async () => {
    const mockUserData = { username: 'testuser', email: 'testuser@example.com' };
    const username = 'testuser';
    axios.get.mockResolvedValueOnce({ data: mockUserData });

    const response = await request(app).get(`/user/get/${username}`);

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(`/user/get/${username}`), {});
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUserData);
  });

  it('should handle /user/get/${username} errors and respond with appropriate status and message', async () => {
    const errorMessage = 'Error fetching user data';
    const username = 'testuser';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    const response = await request(app).get(`/user/get/${username}`);

    expect(axios.get).toHaveBeenCalledWith(`http://localhost:8001/user/get/${username}`, {});
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error fetching user data');
  });

  it('should respond with status 200 for /user/add endpoint', async () => {
    const mockUserData = { username: 'testuser', email: 'testuser@example.com' };
    axios.post.mockResolvedValueOnce({ data: mockUserData });

    const requestBody = { username: 'testuser', password: 'testpassword', email: 'testuser@example.com' };
    const response = await request(app).post('/user/add').send(requestBody);

    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/user/add'), requestBody);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUserData);
  });

  it('should handle /user/add errors and respond with appropriate status and message', async () => {
    const errorMessage = 'Error adding user';
    axios.post.mockRejectedValueOnce(new Error(errorMessage));

    const requestBody = { username: 'testuser', password: 'testpassword', email: 'testuser@example.com' };
    const response = await request(app).post('/user/add').send(requestBody);

    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/user/add'), requestBody);
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Error adding user');
  });

  it('should respond with status 200 for /questions endpoint', async () => {
    const mockQuestionsData = [{ id: 1, question: 'Sample question 1' }, { id: 2, question: 'Sample question 2' }];
    axios.get.mockResolvedValueOnce({ data: mockQuestionsData });
  
    const response = await request(app).get('/questions');
  
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/questions'));
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestionsData);
  });
  
  it('should respond with status 200 for /statistics/edit endpoint', async () => {
    const mockUserData = { username: 'testuser', statistics: { points: 100 } };
    axios.post.mockResolvedValueOnce({ data: mockUserData });
  
    const requestBody = { username: 'testuser', statistics: { points: 100 } };
    const response = await request(app).post('/statistics/edit').send(requestBody);
  
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/statistics/edit'), requestBody);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUserData);
  });

  it('should handle errors for /statistics/edit endpoint and respond with appropriate status and message', async () => {
    const errorMessage = 'Error editing user statistics';
    axios.post.mockRejectedValueOnce(new Error(errorMessage));
  
    const requestBody = { username: 'testuser', statistics: { points: 100 } };
    const response = await request(app).post('/statistics/edit').send(requestBody);
  
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/statistics/edit'), requestBody);
    expect(response.status).toBe(500);
    expect(response.body.error).toBe(errorMessage);
  });
  
  it('should respond with status 200 for /user/statistics/:username endpoint', async () => {
    const mockUserData = { username: 'testuser', statistics: { points: 100 } };
    axios.get.mockResolvedValueOnce({ data: mockUserData });
  
    const response = await request(app).get('/user/statistics/testuser');
  
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/user/statistics/testuser'),{});
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUserData);
  });
  
  it('should handle errors for /user/statistics/:username endpoint and respond with appropriate status and message', async () => {
    const errorMessage = 'Error retrieving user statistics';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));
  
    const response = await request(app).get('/user/statistics/testuser');
  
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/user/statistics/testuser'),{});
    expect(response.status).toBe(500);
    expect(response.body.error).toBe(errorMessage);
  });
  
  it('should respond with status 200 for /user/group/list endpoint', async () => {
    const mockUserGroupData = ['group1', 'group2', 'group3'];
    axios.get.mockResolvedValueOnce({ data: mockUserGroupData });
  
    const response = await request(app).get('/user/group/list').query({ username: 'testuser' });
  
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/user/group/list'), { params: { username: 'testuser' } });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUserGroupData);
  });
  
  it('should handle errors for /user/group/list endpoint and respond with appropriate status and message', async () => {
    const errorMessage = 'Error retrieving user groups';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));
  
    const response = await request(app).get('/user/group/list').query({ username: 'testuser' });
  
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/user/group/list'), { params: { username: 'testuser' } });
    expect(response.status).toBe(500);
    expect(response.body.error).toBe(errorMessage);
  });

  it('should respond with status 200 for /group/add endpoint', async () => {
    const mockUserData = { username: 'testuser', groupName: 'Test Group' };
    axios.post.mockResolvedValueOnce({ data: mockUserData });
  
    const requestBody = { username: 'testuser', groupName: 'Test Group' };
    const response = await request(app).post('/group/add').send(requestBody);
  
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/group/add'), requestBody);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUserData);
  });
  
  it('should handle errors for /group/add endpoint and respond with appropriate status and message', async () => {
    const errorMessage = 'Error adding user to group';
    axios.post.mockRejectedValueOnce({ response: { status: 400, data: { error: errorMessage } } });
  
    const requestBody = { username: 'testuser', groupName: 'Test Group' };
    const response = await request(app).post('/group/add').send(requestBody);
  
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/group/add'), requestBody);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(errorMessage);
  });
  
  it('should respond with status 200 for /group/:name/join endpoint', async () => {
    const groupName = 'Test Group';
    const mockUserData = { username: 'testuser', groupName: groupName };
    axios.post.mockResolvedValueOnce({ data: mockUserData });
  
    const requestBody = { username: 'testuser' };
    const response = await request(app).post(`/group/${groupName}/join`).send(requestBody);
  
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining(`/group/${groupName}/join`), requestBody);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUserData);
  });
  
  it('should handle errors for /group/:name/join endpoint and respond with appropriate status and message', async () => {
    const groupName = 'Test Group';
    const errorMessage = 'Error joining group';
    axios.post.mockRejectedValueOnce({ response: { status: 400, data: { error: errorMessage } } });
  
    const requestBody = { username: 'testuser' };
    const response = await request(app).post(`/group/${groupName}/join`).send(requestBody);
  
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining(`/group/${groupName}/join`), requestBody);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(errorMessage);
  });
  
  it('should respond with status 200 for /group/:name endpoint', async () => {
    const groupName = 'Test Group';
    const mockGroupData = { name: groupName, members: ['user1', 'user2'] };
    axios.get.mockResolvedValueOnce({ data: mockGroupData });
  
    const response = await request(app).get(`/group/${groupName}`);
  
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(`/group/${groupName}`));
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockGroupData);
  });
  
  it('should handle errors for /group/:name endpoint and respond with appropriate status and message', async () => {
    const groupName = 'Test Group';
    const errorMessage = 'Error retrieving group data';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));
  
    const response = await request(app).get(`/group/${groupName}`);
  
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(`/group/${groupName}`));
    expect(response.status).toBe(500);
    expect(response.body.error).toBe(errorMessage);
  });

});