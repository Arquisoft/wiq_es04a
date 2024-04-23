const Question = require('../../services/question-data-model.js');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

let mongoServer;
let questionFunctions;
let questionRoutes;

//let mongoServer;
let app = express();

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
  language: "es"
};

async function addingQuestion(questionData) {
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
  mongoServer = await MongoMemoryServer.create();
  const mongoURI = mongoServer.getUri();
  process.env.DATABASE_URI = mongoURI;
  await mongoose.connect(mongoURI);
  questionFunctions = require('../../services/question-data-service');
  questionRoutes = require('../../routes/question-routes.js');
  app.use(bodyParser.json());
  app.use('/questions', questionRoutes);

});

beforeEach(async () => {
  //Load database with initial conditions
  //await mongoose.connection.dropDatabase();
  await Question.deleteMany({});
  for(var i = 0; i < 100; i++) {
    await addingQuestion(questionData1);
    await addingQuestion(questionData2);
  }
});

  afterAll(async () => {
    // Disconnect testing database after all tests
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  
describe('Question routes', function() {
    it('It should get a question from the database', async function() {
        const response = await request(app).get('/questions/en');
        await expect(response.status).toBe(200);
        await expect(response.body.question).toBe('Which is the capital of Spain?');
      });
    

      it('It should get n questions from the database', async function() {
        const response = await request(app).get('/questions/getQuestionsFromDb/3/en');
        await expect(response.status).toBe(200);
        await expect(response.body.length).toBe(3);
      });

      it('It should not get n questions from the database', async function() {
        const response = await request(app).get('/questions/getQuestionsFromDb/-1/en');
        await expect(response.status).toBe(400);
      });
  
      it('It should get n questions of certain category from the database', async function() {
        const response = await request(app).get('/questions/getQuestionsFromDb/2/Geography/en');
        await expect(response.status).toBe(200);
        await expect(response.body.length).toBe(2);
        await expect(response.body[0].categories[0]).toBe("Geography");
      });

      it('It should not get n questions of certain category from the database', async function() {
        const response = await request(app).get('/questions/getQuestionsFromDb/-1/Geography/en');
        await expect(response.status).toBe(400);
      });
    });

    describe('MongoDB Connection', () => {
        it('should connect to the MongoDB server in memory', async () => {
            expect(mongoose.connection.readyState).toBe(1); // 1 means connected
        });
    });