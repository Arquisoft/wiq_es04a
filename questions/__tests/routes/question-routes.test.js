const express = require('express');
const bodyParser = require('body-parser');
const questionRoutes = require('../../routes/question-routes.js');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const mockAxios = new MockAdapter(axios);


//let mongoServer;
let app = express();
app.use(bodyParser.json());
app.use('/questions', questionRoutes);

const questionData1 = {
    question: "Which is the capital of Spain?",
    options: ["Madrid", "Barcelona", "Paris", "London"],
    correctAnswer: "Madrid",
    categories: ["Geography"],
    language: "en"
};

const questionData2 = {
  question: "Which is the capital of UK?",
  options: ["Madrid", "Barcelona", "Paris", "London"],
  correctAnswer: "London",
  categories: ["Geography"],
  language: "en"
};

  describe('Question routes', function() {
    it('It should get a question', async function() {
        mockAxios.onGet('http://localhost:8000/questions').reply(200, questionData1);
  
        const response = await axios.get('http://localhost:8000/questions');
        await expect(response.status).toBe(200);
        await expect(response.data.question).toBe('Which is the capital of Spain?');
    });

    it('It should get n questions', async function() {
      var array = [questionData1, questionData2, questionData1];
      mockAxios.onGet('/questions/getQuestionsFromDb/3').reply(200, array);
  
      const response = await axios.get('/questions/getQuestionsFromDb/3');
      await expect(response.status).toBe(200);
      await expect(response.data.length).toBe(3);
      await expect(response.data[0].question).toBe('Which is the capital of Spain?');
      await expect(response.data[1].question).toBe('Which is the capital of UK?');
      await expect(response.data[2].question).toBe('Which is the capital of Spain?');

    });

    it('It should not get n questions because parameter is incorrect', async function() {
      mockAxios.onGet('/questions/getQuestionsFromDb/-1').reply(400, 'Parameter "n" must be > 0.');
      try {
        await axios.get('/questions/getQuestionsFromDb/-1');
      } catch (error) {
        // Verifica que la solicitud haya fallado con un código de estado 400
        expect(error.response.status).toBe(400);
        
        // Verifica que la respuesta contenga el mensaje de error esperado
        expect(error.response.data).toBe('Parameter "n" must be > 0.');
      }
    });
  
    it('It should get n questions of certain category from the database', async function() {
      var array = [questionData1, questionData2];
      mockAxios.onGet('/questions/getQuestionsFromDb/2/Geography').reply(200, array);

      const response = await axios.get('/questions/getQuestionsFromDb/2/Geography');
      await expect(response.status).toBe(200);
      await expect(response.data[0].categories[0]).toBe("Geography");
      await expect(response.data[1].categories[0]).toBe("Geography");
      await expect(response.data[0].question).toBe('Which is the capital of Spain?');
      await expect(response.data[1].question).toBe('Which is the capital of UK?');
    });

    it('It should not get n questions of certain category', async function() {
      mockAxios.onGet('/questions/getQuestionsFromDb/-1/Geography').reply(400, 'Parameter "n" must be > 0.');
      try {
        await axios.get('/questions/getQuestionsFromDb/-1/Geography');
      } catch (error) {
        // Verifica que la solicitud haya fallado con un código de estado 400
        expect(error.response.status).toBe(400);
        
        // Verifica que la respuesta contenga el mensaje de error esperado
        expect(error.response.data).toBe('Parameter "n" must be > 0.');
      }
    });
    
  });

