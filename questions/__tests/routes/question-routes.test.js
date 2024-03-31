const Question = require('../../services/question-data-model.js');
//const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const questionRoutes = require('../../routes/question-routes.js');
const questionFunctions = require('../../services/question-data-service');

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

let uri;

if (process.env.DATABASE_URI) {
  uri = 'mongodb://mongodb:27017/test';
} else {
  uri = 'mongodb://localhost:27017/test';
}


async function addQuestion(questionData) {
  const newQuestion = new Question({
    question: questionData.question,
    options: questionData.options,
    correctAnswer: questionData.correctAnswer,
    categories: questionData.categories,
    language: questionData.language
  });
  //await newQuestion.save();
  await questionFunctions.addQuestion(newQuestion);
}

beforeAll(async () => {
   await mongoose.disconnect();
    // Conectar a la base de datos de prueba
    //const uri = 'mongodb://localhost:27017/test';
    await mongoose.connect(uri);
    // Limpiar la colección de preguntas antes de cada prueba
    await Question.deleteMany({});
});

beforeEach(async () => {
  //Load database with initial conditions
  //await mongoose.connection.dropDatabase();
  await Question.deleteMany({});
  for(var i = 0; i < 10; i++) {
    await addQuestion(questionData1);
  }
});

  afterAll(async () => {
    await Question.deleteMany({});
    // Disconnect testing database after all tests
    await mongoose.disconnect();
    //await mongoServer.stop();
  });

  describe('Question routes', function() {
    it('It should get a question from the database', async function() {
        const response = await request(app).get('/questions/');
        await expect(response.status).toBe(200);
        await expect(response.body.question).toBe('Which is the capital of Spain?');
    });

    it('It should get n questions from the database', async function() {
      const response = await request(app).get('/questions/getQuestionsFromDb/3');
      await expect(response.status).toBe(200);
      await expect(response.body[0].question).toBe('Which is the capital of Spain?');
      await expect(response.body[1].question).toBe('Which is the capital of Spain?');
      await expect(response.body[2].question).toBe('Which is the capital of Spain?');

    });

   /* it('It should not get n questions from the database', async function() {
      await mongoose.connection.dropDatabase();
      const response = await request(app).get('/questions/getQuestionsFromDb/2');
      await expect(response.status).toBe(200);
      await expect(response.body).toBe('');
    });*/

    it('It should get n questions of certain category from the database', async function() {
      const response = await request(app).get('/questions/getQuestionsFromDb/2/Geography');
      await expect(response.status).toBe(200);
      await expect(response.body[0].categories[0]).toBe("Geography");
      await expect(response.body[1].categories[0]).toBe("Geography");
      await expect(response.body[0].question).toBe('Which is the capital of Spain?');
      await expect(response.body[1].question).toBe('Which is the capital of Spain?');
    });

  });

describe('MongoDB Connection', () => {
    it('should connect to the MongoDB server in memory', async () => {
        expect(mongoose.connection.readyState).toBe(1); // 1 means connected
    });
});
