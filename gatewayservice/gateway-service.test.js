const axios = require('axios');
const request = require('supertest');
const app = require('./gateway-service.js');

jest.mock('axios');

describe('Routes Tests', () => {

  afterEach(() => {
    jest.clearAllMocks();
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

    expect(axios.get).toHaveBeenCalledWith(`http://localhost:8001/user/get/${username}`, {});
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
});