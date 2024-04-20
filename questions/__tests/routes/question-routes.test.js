const Question = require('../../services/question-data-model.js');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');



let mongoServer;
let questionFunctions;
let questionRoutes;
let generateQuestionsService;


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
  question: "Which is the capital of Spain?",
  options: ["Madrid", "Barcelona", "Paris", "London"],
  correctAnswer: "London",
  categories: ["Geography"],
  language: "en"
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

async function addingQuestions() {
  for(var i = 0; i < 24; i++) {
    await addingQuestion(questionData1);
    await addingQuestion(questionData2);
  }
}

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoURI = mongoServer.getUri();
  process.env.DATABASE_URI = mongoURI;
  await mongoose.connect(mongoURI);
  questionFunctions = require('../../services/question-data-service');
  questionRoutes = require('../../routes/question-routes.js');
  generateQuestionsService = require('../../services/generate-questions-service');
  jest.mock('../../services/generate-questions-service');
  app.use(bodyParser.json());
  app.use('/questions', questionRoutes);
});

beforeEach(async () => {
  //Load database with initial conditions
  //await mongoose.connection.dropDatabase();
  await Question.deleteMany({});
  await addingQuestions();
});

  afterAll(async () => {
    // Disconnect testing database after all tests
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  
describe('Question routes', function() {
  
  describe('Get a question from the database', function() {
    it('get question when 0 questions', async function() {
      await Question.deleteMany({});
      await generateQuestionsService.generateQuestions.mockResolvedValue({"response":{"status":"200"}});
      const response = await request(app).get('/questions/es');
      await expect(response.status).toBe(200);
      await expect(response.body.question).toBe(undefined);
    });

    it('get question when less than 50 questions', async function() {
        await generateQuestionsService.generateQuestions.mockResolvedValue({"response":{"status":"200"}});
        const response = await request(app).get('/questions/en');
        await expect(response.status).toBe(200);
        await expect(response.body.question).toBe('Which is the capital of Spain?');
      });

    it('get question when less than 100 questions', async function() {
        await addingQuestions();
        await generateQuestionsService.generateQuestions.mockResolvedValue({"response":{"status":"200"}});
        const response = await request(app).get('/questions/en');
        await expect(response.status).toBe(200);
        await expect(response.body.question).toBe('Which is the capital of Spain?');
      });  

    it('get question when more than 100 questions', async function() {
        await addingQuestions();
        await addingQuestions();
        await generateQuestionsService.generateQuestions.mockResolvedValue({"response":{"status":"200"}});
        const response = await request(app).get('/questions/en');
        await expect(response.status).toBe(200);
        await expect(response.body.question).toBe('Which is the capital of Spain?');
      });  
  });
  describe('Get n questions from the database', function() {

      it('It should get n questions from the database', async function() {
        await generateQuestionsService.generateQuestions.mockResolvedValue({"response":{"status":"200"}});
        const response = await request(app).get('/questions/getQuestionsFromDb/3/en');
        await expect(response.status).toBe(200);
        await expect(response.body.length).toBe(3);
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
    });
  describe('Question routes', function() {
    
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
  });