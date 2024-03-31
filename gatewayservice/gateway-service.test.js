const request = require('supertest');
const axios = require('axios');
const app = require('./gateway-service'); 

afterAll(async () => {
    app.close();
  });

jest.mock('axios');

describe('Gateway Service', () => {


  // Mock responses from external services
  axios.post.mockImplementation((url, data) => {
    if (url.endsWith('/login')) {
      return Promise.resolve({ data: { token: 'mockedToken' } });
    } else if (url.endsWith('/adduser')) {
      return Promise.resolve({ data: { userId: 'mockedUserId' } });
    }else if( url.endsWith('/questions')){
      return Promise.resolve({id: "mockQuestion", 
          "question": "mockQuestion?", options: ["o1","o2","o3"], correctAnswer: "o1"});
    }
  });




  // Test /login endpoint
  it('should forward login request to auth service', async () => {
    const response = await request(app)
      .post('/login') 
      .send({ username: 'testuser', password: 'testpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBe('mockedToken');
  });

  // Test /adduser endpoint
  it('should forward add user request to user service', async () => {
    const response = await request(app)
      .post('/adduser')
      .send({ username: 'newuser', password: 'newpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe('mockedUserId');
  });


  //    /questions
  it('should forward request to questions service', async () => {
    const response = await request(app)
      .get('/questions');

    expect(response.statusCode).toBe(200);
    expect(responde.body.id).toBe("mockQuestion");
    expect(responde.body.correctAnswer).toBe("o1");


  });

  //    /statistics/edit

  //    /statistics/:username

  //    /group/list

  //    /group/add

  //    /group/:name

  //    /group/:name/join

});